import passport from 'koa-passport'
import Router from 'koa-router'

const router = new Router({
  prefix: '/manage',
})

router.use(passport.authenticate('jwt', { session: false }))

router.post('/edit/:key', async ctx => {
  return (ctx.status = 501)
})

router.post('/delete/:key', async ctx => {
  return (ctx.status = 501)
})

export { router as manageRouter }
