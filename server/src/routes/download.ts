import cors from '@koa/cors'
import Router from 'koa-router'
import { DUMP_PATH } from '../constants'
import { IS_DEV, PORT } from '../env'
import { rateLimit } from '../middleware/ratelimit'
import Beatmap from '../mongo/models/Beatmap'
import { globStats } from '../utils/fs'
import { parseKey } from '../utils/parseKey'

const router = new Router({
  prefix: '/download',
})
  .use(
    rateLimit({
      duration: 10 * 60 * 1000,
      max: 10,
    })
  )
  .use(cors())

router.get('/key/:key', async ctx => {
  const key = parseKey(ctx.params.key)
  if (key === false) return (ctx.status = 404)

  const map = await Beatmap.findOne({ key, deletedAt: null })
  if (!map) return (ctx.status = 404)

  map.stats.downloads += 1
  await map.save()

  return ctx.redirect(map.directDownload)
})

router.get('/hash/:hash', async ctx => {
  const { hash } = ctx.params

  const map = await Beatmap.findOne({ hash, deletedAt: null })
  if (!map) return (ctx.status = 404)

  map.stats.downloads += 1
  await map.save()

  return ctx.redirect(map.directDownload)
})

router.get('/dump/:type', async ctx => {
  const type: string = ctx.params.type
  if (type !== 'maps' && type !== 'users') return (ctx.status = 404)

  const files = await globStats([`${type}.*.json`, `!${type}.temp.json`], {
    cwd: DUMP_PATH,
  })

  const [path] = [...files]
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .map(x => x.path)

  if (!path) return (ctx.status = 503)
  const cdnPath = `/cdn/dumps/${path}`
  const absolute = IS_DEV ? `http://localhost:${PORT}${cdnPath}` : cdnPath

  return ctx.redirect(absolute)
})

export { router as downloadRouter }
