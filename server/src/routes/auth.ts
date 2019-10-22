import { hash } from 'bcrypt'
import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import uuid from 'uuid/v4'
import { BCRYPT_ROUNDS, IS_DEV } from '~environment'
import mailDriver, { sendTo } from '~mail'
import { IUserModel, User } from '~mongo/models'
import { issueToken } from '~strategies'

const sendMail = mailDriver()
const router = new Router({
  prefix: '/auth',
}).use(koaBody({ text: false, urlencoded: false }))

router.post('/register', async ctx => {
  const { username, email, password } = ctx.request.body

  const hashed = password ? await hash(password, BCRYPT_ROUNDS) : undefined
  const verifyToken = uuid()

  const user = await User.create({
    email,
    password: hashed,
    username,
    verified: false,
    verifyToken,
  })

  const verifyLink = IS_DEV
    ? `${ctx.origin}/auth/verify/${verifyToken}`
    : `${ctx.origin}/api/auth/verify/${verifyToken}`

  await sendMail(
    sendTo(user),
    'BeatSaver Account Verification',
    `To verify your account, please click the link below:\n${verifyLink}`
  )

  const token = await issueToken(user)
  ctx.set('x-auth-token', token)
  return (ctx.status = 204)
})

router.get('/verify/:token', async ctx => {
  const verifyToken: string = ctx.params.token

  const user = await User.findOne({ verifyToken })
  if (!user) return (ctx.status = 404)

  user.verified = true
  user.verifyToken = null
  await user.save()

  return ctx.redirect('/')
})

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
