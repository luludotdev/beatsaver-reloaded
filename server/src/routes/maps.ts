import Router from 'koa-router'
import { RESULTS_PER_PAGE } from '../env'
import Beatmap from '../mongo/models/Beatmap'

const router = new Router({
  prefix: '/maps',
})

router.get('/latest/:page?', async ctx => {
  const page = (Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0) + 1
  const { docs: maps, totalPages } = await Beatmap.paginate(
    {},
    { page, limit: RESULTS_PER_PAGE, sort: '-uploaded' }
  )

  const lastPage = (totalPages as number) - 1
  return (ctx.body = { maps, lastPage })
})

router.get('/downloads/:page?', async ctx => {
  const page = (Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0) + 1
  const { docs: maps, totalPages } = await Beatmap.paginate(
    {},
    { page, limit: RESULTS_PER_PAGE, sort: '-stats.downloads -uploaded' }
  )

  const lastPage = (totalPages as number) - 1
  return (ctx.body = { maps, lastPage })
})

router.get('/plays/:page?', async ctx => {
  const page = (Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0) + 1
  const { docs: maps, totalPages } = await Beatmap.paginate(
    {},
    { page, limit: RESULTS_PER_PAGE, sort: '-stats.plays -uploaded' }
  )

  const lastPage = (totalPages as number) - 1
  return (ctx.body = { maps, lastPage })
})

export { router as mapsRouter }
