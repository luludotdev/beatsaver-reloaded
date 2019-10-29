import cors from '@koa/cors'
import Router from 'koa-router'
import { cache, rateLimit } from '~middleware'

const router = new Router({
  prefix: '/legal',
})
  .use(cors())
  .use(
    rateLimit({
      duration: 10 * 1000,
      max: 200,
    })
  )
  .use(cache({ prefix: 'legal', expire: 60 * 15 }))

router.get('/dmca', async ctx => {
  return (ctx.status = 501)
})

router.get('/privacy', async ctx => {
  return (ctx.status = 501)
})

export { router as legalRouter }
