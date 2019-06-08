import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'

const router = new Router({
  prefix: '/download',
})

router.get('/key/:key', async ctx => {
  return (ctx.status = 501)
})

router.get('/hash/:hash', async ctx => {
  return (ctx.status = 501)
})

export { router as downloadRouter }
