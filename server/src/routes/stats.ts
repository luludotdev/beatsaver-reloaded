import cors from '@koa/cors'
import Router from 'koa-router'
import { cache, rateLimit } from '~middleware'
import { Beatmap } from '~mongo/models'
import { parseKey } from '~utils/parseKey'

const router = new Router({
  prefix: '/stats',
})
  .use(cors())
  .use(
    rateLimit({
      duration: 1 * 1000,
      max: 10,
    })
  )

const findMap = async <T extends object = any>(query: T) => {
  const map = await Beatmap.findOne(
    { ...query, deletedAt: null },
    { stats: 1, _id: 1, hash: 1, key: 1 }
  )

  if (!map) return null
  const transformed = {
    _id: map._id,
    hash: map.hash,
    key: map.key,
    stats: map.stats,
  }

  return transformed
}

router.get(
  '/key/:key',
  cache({ prefix: ctx => `stats:key:${ctx.params.key}:`, expire: 60 * 10 }),
  async ctx => {
    const key = parseKey(ctx.params.key)
    if (key === false) return (ctx.status = 404)

    const map = await findMap({ key })
    if (!map) return (ctx.status = 404)

    return (ctx.body = map)
  }
)

router.get(
  '/by-hash/:hash',
  cache({ prefix: ctx => `stats:hash:${ctx.params.hash}:`, expire: 60 * 10 }),
  async ctx => {
    if (typeof ctx.params.hash !== 'string') return (ctx.status = 400)
    const hash = ctx.params.hash.toLowerCase()

    const map = await findMap({ hash })
    if (!map) return (ctx.status = 404)

    return (ctx.body = map)
  }
)

export { router as statsRouter }
