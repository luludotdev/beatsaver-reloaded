import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'

const router = new Router({
  prefix: '/download',
})

router.get('/key/:key', async ctx => {
  const { key } = ctx.params

  const map = await Beatmap.findOne({ key })
  if (!map) return (ctx.status = 404)

  map.stats.downloads += 1
  await map.save()

  return ctx.redirect(map.directDownload)
})

router.get('/hash/:hash', async ctx => {
  const { hash } = ctx.params

  const map = await Beatmap.findOne({ hash })
  if (!map) return (ctx.status = 404)

  map.stats.downloads += 1
  await map.save()

  return ctx.redirect(map.directDownload)
})

export { router as downloadRouter }
