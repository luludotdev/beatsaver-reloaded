import Router from 'koa-router'
import { rateLimit } from '../middleware/ratelimit'
import Beatmap from '../mongo/models/Beatmap'
import { parseKey } from '../utils/parseKey'

const router = new Router({
  prefix: '/download',
}).use(
  rateLimit({
    duration: 1000,
    max: 1,
  })
)

router.get('/key/:key', async ctx => {
  const key = parseKey(ctx.params.key)
  if (key === false) return (ctx.status = 404)

  const map = await Beatmap.findOne({ key, deletedAt: null }, '-votes')
  if (!map) return (ctx.status = 404)

  map.stats.downloads += 1
  await map.save()

  return ctx.redirect(map.directDownload)
})

router.get('/hash/:hash', async ctx => {
  const { hash } = ctx.params

  const map = await Beatmap.findOne({ hash, deletedAt: null }, '-votes')
  if (!map) return (ctx.status = 404)

  map.stats.downloads += 1
  await map.save()

  return ctx.redirect(map.directDownload)
})

export { router as downloadRouter }
