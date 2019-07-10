import cors from '@koa/cors'
import Router from 'koa-router'
import { cache } from '../middleware/cache'
import { rateLimit } from '../middleware/ratelimit'

const router = new Router({
  prefix: '/stats',
})
  .use(cors())
  .use(
    rateLimit({
      duration: 1 * 1000,
      max: 10,
    })
  )

router.get(
  '/key/:key',
  cache({ prefix: ctx => `stats:key:${ctx.params.key}:`, expire: 60 * 10 }),
  async ctx => {
    return (ctx.status = 501)
  }
)

router.get(
  '/by-hash/:hash',
  cache({ prefix: ctx => `stats:hash:${ctx.params.key}:`, expire: 60 * 10 }),
  async ctx => {
    return (ctx.status = 501)
  }
)

export { router as statsRouter }
