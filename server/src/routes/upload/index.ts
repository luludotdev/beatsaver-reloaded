import fileType from 'file-type'
import multer, { File, MulterIncomingMessage } from 'koa-multer'
import passport from 'koa-passport'
import Router from 'koa-router'
import { MongoError } from 'mongodb'
import { join } from 'path'
import { CDN_PATH } from '../../constants'
import { clearCache } from '../../middleware/cache'
import Beatmap from '../../mongo/models/Beatmap'
import { IUserModel } from '../../mongo/models/User'
import { mkdirp, writeFile } from '../../utils/fs'
import { parseBeatmap } from './parseBeatmap'

import {
  ERR_BEATMAP_NOT_ZIP,
  ERR_BEATMAP_SAVE_FAILURE,
  ERR_DUPLICATE_BEATMAP,
  ERR_NO_BEATMAP,
  ERR_UNKNOWN_BEATMAP,
} from './errors'

const upload = multer({
  limits: { fileSize: 1000 * 1000 * 15 },
  storage: multer.memoryStorage(),
})

const router = new Router({
  prefix: '/upload',
}).use(upload.any())

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const user: IUserModel = ctx.state.user
    const { files: f, body } = ctx.req as MulterIncomingMessage
    const { name, description } = body || ({} as any)
    const files = f as File[]

    const beatmapFile = (files || []).find(x => x.fieldname === 'beatmap')
    if (beatmapFile === undefined) {
      throw ERR_NO_BEATMAP
    }

    const type = fileType(beatmapFile.buffer)
    if (type === undefined) {
      throw ERR_UNKNOWN_BEATMAP
    } else if (type.mime !== 'application/zip') {
      throw ERR_BEATMAP_NOT_ZIP
    }

    const { parsed: beatmap, cover } = await parseBeatmap(beatmapFile.buffer)
    const duplicates = await Beatmap.find({ hash: beatmap.hash })
    if (duplicates.length > 0) throw ERR_DUPLICATE_BEATMAP

    const [latest] = await Beatmap.find()
      .sort({ key: -1 })
      .limit(1)

    try {
      const nextKey = ((parseInt(latest && latest.key, 16) || 0) + 1).toString(
        16
      )

      const beatmapDir = join(CDN_PATH, nextKey)
      await mkdirp(beatmapDir)
      await writeFile(
        join(beatmapDir, `${beatmap.hash}.zip`),
        beatmapFile.buffer
      )
      await writeFile(
        join(beatmapDir, `${beatmap.hash}${beatmap.coverExt}`),
        cover
      )

      const newBeatmap = await Beatmap.create({
        description,
        key: nextKey,
        name,
        uploader: user._id,

        ...beatmap,
      })

      await clearCache('maps')
      await newBeatmap.populate('uploader').execPopulate()
      return (ctx.body = newBeatmap)
    } catch (err) {
      if (err instanceof MongoError || err.name === 'ValidationError') throw err

      console.error(err)
      throw ERR_BEATMAP_SAVE_FAILURE
    }
  }
)

export { router as uploadRouter }
