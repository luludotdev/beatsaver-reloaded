import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'

const router = new Router({
  prefix: '/api/v1.0',
})

router.get('/maps/:page?', async ctx => {
  const page = (Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0) + 1
  const { docs, totalPages } = await Beatmap.paginate({}, { page, limit: 10 })
  const lastPage = (totalPages as number) - 1

  return (ctx.body = { maps: docs, lastPage })
})

export { router as apiRouter }
