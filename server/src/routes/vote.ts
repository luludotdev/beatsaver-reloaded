import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'

const router = new Router({
  prefix: '/vote',
}).use(koaBody({ text: false, urlencoded: false }))

router.post(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  ctx => {
    return (ctx.status = 501)
  }
)

router.post('/steam/:id', ctx => {
  return (ctx.status = 501)
})

export { router as voteRouter }
