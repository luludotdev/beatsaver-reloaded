import { ParameterizedContext } from 'koa'
import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'
import { IUserModel } from '../mongo/models/User'
import CodedError from '../utils/CodedError'

const router = new Router({
  prefix: '/vote',
}).use(koaBody({ text: false, urlencoded: false }))

const ERR_INVALID_DIRECTION = new CodedError(
  'invalid vote direction',
  0x50001,
  'ERR_INVALID_DIRECTION'
)

router.post(
  '/user/:key',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const user: IUserModel = ctx.state.user
    const voterUID = `${user._id}`

    return submitVote(ctx, voterUID)
  }
)

router.post('/steam/:key', ctx => {
  return (ctx.status = 501)
})

const submitVote = async (ctx: ParameterizedContext, voterUID: string) => {
  const { direction: d } = ctx.request.body
  const direction: number = parseInt(d, 10)
  if (direction !== -1 && direction !== 1) throw ERR_INVALID_DIRECTION

  const { key } = ctx.params
  const map = await Beatmap.findOne({ key })
  if (!map) return (ctx.status = 404)

  const existingVote = map.votes.find(x => x.voterUID === voterUID)
  if (existingVote) {
    existingVote.direction = direction
  } else {
    map.votes.push({ voterUID, direction })
  }

  await map.save()
  return (ctx.status = 204)
}

export { router as voteRouter }
