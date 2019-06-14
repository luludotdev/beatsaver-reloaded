import { hash } from 'bcrypt'
import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import { BCRYPT_ROUNDS } from '../env'
import User, { IRedactedUser, IUserModel } from '../mongo/models/User'
import { issueToken } from '../strategies/jwt'

const router = new Router({
  prefix: '/auth',
}).use(koaBody({ text: false, urlencoded: false }))

// router.post('/register', async ctx => {
//   const { username, email, password } = ctx.request.body

//   const hashed = password ? await hash(password, BCRYPT_ROUNDS) : undefined
//   const user = await User.create({ username, email, password: hashed })
//   const token = await issueToken(user)

//   ctx.set('x-auth-token', token)
//   return (ctx.status = 204)
// })

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
