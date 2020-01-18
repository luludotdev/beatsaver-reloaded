import cors from '@koa/cors'
import Router from 'koa-router'
import { getCache, rateLimit, setCache } from '~middleware'
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

router.get('/key/:key', async ctx => {
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  const cache = await getCache(`stats:key:${ctx.params.key}`)

  if (cache) {
    ctx.set('X-Koa-Redis-Cache', 'true')
    return (ctx.body = cache)
  }

  const key = parseKey(ctx.params.key)
  if (key === false) return (ctx.status = 404)

  const map = await findMap({ key })
  if (!map) return (ctx.status = 404)

  const mapEncoded = JSON.stringify(map)
  await setCache(`stats:key:${ctx.params.key}`, mapEncoded, 60 * 10)
  ctx.set('X-Koa-Redis-Cache', 'false')
  return (ctx.body = mapEncoded)
})

router.get('/by-hash/:hash', async ctx => {
  if (typeof ctx.params.hash !== 'string') return (ctx.status = 400)

  ctx.set('Content-Type', 'application/json; charset=utf-8')
  const cache = await getCache(`stats:hash:${ctx.params.hash}`)

  if (cache) {
    ctx.set('X-Koa-Redis-Cache', 'true')
    return (ctx.body = cache)
  }

  const hash = ctx.params.hash.toLowerCase()

  const map = await findMap({ hash })
  if (!map) return (ctx.status = 404)

  const mapEncoded = JSON.stringify(map)
  await setCache(`stats:hash:${ctx.params.hash}`, mapEncoded, 60 * 10)
  ctx.set('X-Koa-Redis-Cache', 'false')

  return (ctx.body = mapEncoded)
})

export { router as statsRouter }
