import fileType from 'file-type'
import multer, { File, MulterIncomingMessage } from 'koa-multer'
import passport from 'koa-passport'
import Router from 'koa-router'
import { MongoError } from 'mongodb'
import { join } from 'path'
import { CDN_PATH } from '../../constants'
import Beatmap from '../../mongo/models/Beatmap'
import { IUserModel } from '../../mongo/models/User'
import CodedError from '../../utils/CodedError'
import { mkdirp, writeFile } from '../../utils/fs'
import { parseBeatmap } from './parseBeatmap'

const ERR_NO_BEATMAP = new CodedError(
  'no beatmap uploaded',
  0x30001,
  'ERR_NO_BEATMAP',
  400
)

const ERR_UNKNOWN_BEATMAP = new CodedError(
  'beatmap file type is unknown',
  0x30002,
  'ERR_UNKNOWN_BEATMAP',
  400
)

const ERR_BEATMAP_NOT_ZIP = new CodedError(
  'beatmap is not a zip',
  0x30003,
  'ERR_BEATMAP_NOT_ZIP',
  400
)

const ERR_DUPLICATE_BEATMAP = new CodedError(
  'beatmap hash already exists',
  0x30004,
  'ERR_DUPLICATE_BEATMAP',
  409
)

const ERR_BEATMAP_SAVE_FAILURE = new CodedError(
  'beatmap failed to save',
  0x30005,
  'ERR_BEATMAP_SAVE_FAILURE',
  500
)

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
    const { files: f } = ctx.req as MulterIncomingMessage
    const files = f as File[]

    const beatmapFile = files.find(x => x.fieldname === 'beatmap')
    if (beatmapFile === undefined) {
      throw ERR_NO_BEATMAP
    }

    const type = fileType(beatmapFile.buffer)
    if (type === undefined) {
      throw ERR_UNKNOWN_BEATMAP
    } else if (type.mime !== 'application/zip') {
      throw ERR_BEATMAP_NOT_ZIP
    }

    const beatmap = await parseBeatmap(beatmapFile.buffer)
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

      const newBeatmap = await Beatmap.create({
        key: nextKey,
        name: beatmap.metadata.songName,
        uploader: user._id,

        ...beatmap,
      })

      return (ctx.body = newBeatmap)
    } catch (err) {
      if (err instanceof MongoError) throw err
      else throw ERR_BEATMAP_SAVE_FAILURE
    }
  }
)

export { router as uploadRouter }
