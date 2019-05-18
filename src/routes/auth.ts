import jwt from 'jsonwebtoken'
import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import { JWT_SECRET } from '../env'
import { IUserModel } from '../mongo/models/User'
import { IAuthToken } from '../strategies/jwt'
import { plusDays } from '../utils/misc'

const router = new Router({
  prefix: '/auth',
}).use(koaBody({ text: false, urlencoded: false }))

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async ctx => {
    const user: IUserModel = ctx.state.user

    const issued = new Date()
    const expires = plusDays(7)

    const payload: IAuthToken = {
      _id: user._id,
      admin: user.admin,
      username: user.username,

      expires,
      issued,
    }

    const token = jwt.sign(payload, JWT_SECRET)
    ctx.set('x-auth-token', token)
    return (ctx.status = 204)
  }
)

export { router as authRouter }
