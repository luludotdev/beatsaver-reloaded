import { Middleware } from 'koa'
import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import { clearCache } from '~middleware'
import { Beatmap, IBeatmapModel, IUserModel } from '~mongo/models'
import { parseKey } from '~utils/parseKey'

const router = new Router({
  prefix: '/manage',
})
  .use(passport.authenticate('jwt', { session: false }))
  .use(koaBody({ text: false, urlencoded: false }))

const userBeatmap: Middleware = async (ctx, next) => {
  const key = parseKey(ctx.params.key, true)
  if (!key) return (ctx.status = 404)

  const map = await Beatmap.findOne({ key, deletedAt: null })
  if (!map) return (ctx.status = 404)

  const user: IUserModel = ctx.state.user
  if (`${map.uploader}` !== `${user.id}` && user.admin === false) {
    return (ctx.status = 403)
  }

  ctx.beatmap = map
  return next()
}

router.post('/edit/:key', userBeatmap, async ctx => {
  const map: IBeatmapModel = ctx.beatmap
  const { name, description } = ctx.request.body || ({} as any)

  map.name = name
  map.description = description
  await map.save()

  await Promise.all([
    clearCache(`key:${map.key}`),
    clearCache(`hash:${map.hash}`),
    clearCache('maps'),
    clearCache(`uploader:${map.uploader}`),
  ])

  return (ctx.status = 204)
})

router.post('/delete/:key', userBeatmap, async ctx => {
  const map: IBeatmapModel = ctx.beatmap

  map.deletedAt = new Date()
  await map.save()

  await Promise.all([
    clearCache(`key:${map.key}`),
    clearCache(`hash:${map.hash}`),
    clearCache('maps'),
    clearCache(`uploader:${map.uploader}`),
  ])

  return (ctx.status = 204)
})

export { router as manageRouter }
