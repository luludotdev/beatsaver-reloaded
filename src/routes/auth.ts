import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import { IUserModel } from '../mongo/models/User'
import { issueToken } from '../strategies/jwt'

const router = new Router({
  prefix: '/auth',
}).use(koaBody({ text: false, urlencoded: false }))

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async ctx => {
    const user: IUserModel = ctx.state.user
    const token = await issueToken(user)

    ctx.set('x-auth-token', token)
    return (ctx.status = 204)
  }
)

export { router as authRouter }
