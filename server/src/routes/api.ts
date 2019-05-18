import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'

const router = new Router({
  prefix: '/api/v1.0',
})

router.get('/maps', async ctx => {
  const maps = await Beatmap.find({})
    .limit(10)
    .populate('uploader')

  return (ctx.body = maps)
})

export { router as apiRouter }
