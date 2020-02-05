import cors from '@koa/cors'
import passport from 'koa-passport'
import Router from 'koa-router'
import { rateLimit } from '~middleware'
import { IRedactedUser, IUserModel, User } from '~mongo/models'

const router = new Router({
  prefix: '/users',
}).use(cors())

router.get(
  '/me',
  rateLimit(10 * 1000, 50),
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

router.get(
  '/find/:id',
  rateLimit({
    duration: 20 * 1000,
    id: ctx => `/users/find:${ctx.realIP}`,
    max: 10,
  }),
  async ctx => {
    try {
      const user = await User.findById(ctx.params.id, '-password -email')
      if (!user) return (ctx.status = 404)

      return (ctx.body = user)
    } catch (err) {
      if (err.name === 'CastError') return (ctx.status = 404)
      else throw err
    }
  }
)

export { router as usersRouter }
