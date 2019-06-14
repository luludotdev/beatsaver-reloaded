import cors from '@koa/cors'
import passport from 'koa-passport'
import Router from 'koa-router'
import { IRedactedUser, IUserModel } from '../mongo/models/User'

const router = new Router({
  prefix: '/users',
}).use(cors())

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const user: IUserModel = ctx.state.user

    interface IUserID {
      _id: string
    }

    const userInfo: IRedactedUser & IUserID = {
      _id: user._id,
      admin: user.admin,
      links: user.links,
      username: user.username,
      verified: user.verified,
    }

    return (ctx.body = userInfo)
  }
)

export { router as usersRouter }
