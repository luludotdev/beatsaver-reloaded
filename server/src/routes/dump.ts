import { createReadStream, createWriteStream } from 'fs'
import Router from 'koa-router'
import { join } from 'path'
import { DUMP_PATH } from '../constants'
import { rateLimit } from '../middleware/ratelimit'
import Beatmap from '../mongo/models/Beatmap'
import User from '../mongo/models/User'
import { exists, mkdirp, stat } from '../utils/fs'
import { jsonStream } from '../utils/streams'

const router = new Router({
  prefix: '/dump',
})

const mapDump = join(DUMP_PATH, 'maps.json')

router.get('/maps', async ctx => {
  await mkdirp(DUMP_PATH)

  const isStale = async () => {
    const fileExists = await exists(mapDump)
    if (!fileExists) return true

    const stats = await stat(mapDump)
    const now = new Date()

    if (stats.mtime.getUTCDay() !== now.getUTCDay()) return true
    if (stats.mtime.getUTCMonth() !== now.getUTCMonth()) return true
    if (stats.mtime.getUTCFullYear() !== now.getUTCFullYear()) return true

    return false
  }

  const stale = await isStale()
  if (stale) {
    await new Promise(resolve => {
      const writeStream = createWriteStream(mapDump)
      writeStream.on('close', () => resolve())

      Beatmap.find({}, '-votes')
        .sort({ uploaded: -1 })
        .populate('uploader')
        .cursor()
        .pipe(jsonStream())
        .pipe(writeStream)
    })
  }

  ctx.set('Content-Type', 'application/json')
  const readStream = createReadStream(mapDump)

  return (ctx.body = readStream)
})

router.get('/users', rateLimit(1000 * 60 * 60 * 12, 10), async ctx => {
  const maps = User.find({}, '-password -email -verified -verifyToken -admin')
    .cursor()
    .pipe(jsonStream())

  return (ctx.body = maps)
})

export { router as dumpRouter }
