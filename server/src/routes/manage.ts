import { Middleware } from 'koa'
import passport from 'koa-passport'
import Router from 'koa-router'
import Beatmap, { IBeatmapModel } from '../mongo/models/Beatmap'
import { IUserModel } from '../mongo/models/User'
import { parseKey } from '../utils/parseKey'

const router = new Router({
  prefix: '/manage',
}).use(passport.authenticate('jwt', { session: false }))

const userBeatmap: Middleware = async (ctx, next) => {
  const key = parseKey(ctx.params.key, true)
  if (!key) return (ctx.status = 404)

  const map = await Beatmap.findOne({ key, deletedAt: null })
  if (!map) return (ctx.status = 404)

  const user: IUserModel = ctx.state.user
  if (`${map.uploader}` !== `${user.id}`) return (ctx.status = 403)

  ctx.beatmap = map
  return next()
}

router.post('/edit/:key', userBeatmap, async ctx => {
  const map: IBeatmapModel = ctx.beatmap
  return (ctx.status = 501)
})

router.post('/delete/:key', userBeatmap, async ctx => {
  const map: IBeatmapModel = ctx.beatmap

  map.deletedAt = new Date()
  await map.save()

  return (ctx.status = 204)
})

export { router as manageRouter }
