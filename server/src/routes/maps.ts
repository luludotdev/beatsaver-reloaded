import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'
import { paginate } from '../mongo/plugins/paginate'

const router = new Router({
  prefix: '/maps',
})

router.get('/latest/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    {},
    { page, sort: '-uploaded', populate: 'uploader' }
  )

  return (ctx.body = maps)
})

router.get('/downloads/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    {},
    { page, sort: '-stats.downloads -uploaded', populate: 'uploader' }
  )

  return (ctx.body = maps)
})

router.get('/plays/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    {},
    { page, sort: '-stats.plays -uploaded', populate: 'uploader' }
  )

  return (ctx.body = maps)
})

export { router as mapsRouter }
