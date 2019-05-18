import Router from 'koa-router'
import { RESULTS_PER_PAGE } from '../env'
import Beatmap from '../mongo/models/Beatmap'
import { paginate } from '../mongo/plugins/paginate'

const router = new Router({
  prefix: '/maps',
})

router.get('/latest/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(Beatmap, {}, { page, sort: '-uploaded' })

  return (ctx.body = { maps: maps.docs, ...maps, docs: undefined })
})

router.get('/downloads/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    {},
    { page, sort: '-stats.downloads -uploaded' }
  )

  return (ctx.body = { maps: maps.docs, ...maps, docs: undefined })
})

router.get('/plays/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    {},
    { page, sort: '-stats.plays -uploaded' }
  )

  return (ctx.body = { maps: maps.docs, ...maps, docs: undefined })
})

export { router as mapsRouter }
