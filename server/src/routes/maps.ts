import cors from '@koa/cors'
import Router from 'koa-router'
import { cache, rateLimit } from '~middleware'
import { Beatmap } from '~mongo/models'
import { paginate } from '~mongo/plugins'
import { parseKey } from '~utils/parseKey'

const router = new Router({
  prefix: '/maps',
}).use(cors())

const mapCache = cache({ prefix: 'maps', expire: 60 * 10 })
const routeLimiter = (id: string) =>
  rateLimit({
    duration: 30 * 1000,
    id: ctx => `/maps${id}:${ctx.realIP}`,
    max: 90,
  })

router.get('/latest/:page?', routeLimiter('/latest'), mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-uploaded', populate: 'uploader', projection: '-votes' }
  )

  return (ctx.body = maps)
})

router.get(
  '/downloads/:page?',
  routeLimiter('/downloads'),
  mapCache,
  async ctx => {
    const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
    const maps = await paginate(
      Beatmap,
      { deletedAt: null },
      {
        page,
        populate: 'uploader',
        projection: '-votes',
        sort: '-stats.downloads',
      }
    )

    return (ctx.body = maps)
  }
)

router.get('/plays/:page?', routeLimiter('/plays'), mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    {
      page,
      populate: 'uploader',
      projection: '-votes',
      sort: '-stats.plays',
    }
  )

  return (ctx.body = maps)
})

router.get('/hot/:page?', routeLimiter('/hot'), mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-stats.heat', populate: 'uploader', projection: '-votes' }
  )

  return (ctx.body = maps)
})

router.get('/rating/:page?', routeLimiter('/rating'), mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-stats.rating', populate: 'uploader', projection: '-votes' }
  )

  return (ctx.body = maps)
})

const detailRL = rateLimit({
  duration: 5 * 1000,
  max: 50,
})

router.get(
  '/detail/:key',
  detailRL,
  cache({ prefix: ctx => `key:${ctx.params.key}:`, expire: 60 * 10 }),
  async ctx => {
    const key = parseKey(ctx.params.key)
    if (key === false) return (ctx.status = 404)

    const map = await Beatmap.findOne({ key, deletedAt: null }, '-votes')
    if (!map) return (ctx.status = 404)

    await map.populate('uploader').execPopulate()
    return (ctx.body = map)
  }
)

router.get(
  '/by-hash/:hash',
  detailRL,
  cache({ prefix: ctx => `hash:${ctx.params.hash}:`, expire: 60 * 10 }),
  async ctx => {
    if (typeof ctx.params.hash !== 'string') return (ctx.status = 400)

    const map = await Beatmap.findOne(
      {
        deletedAt: null,
        hash: ctx.params.hash.toLowerCase(),
      },
      '-votes'
    )

    if (!map) return (ctx.status = 404)

    await map.populate('uploader').execPopulate()
    return (ctx.body = map)
  }
)

router.get(
  '/uploader/:id/:page?',
  rateLimit({
    duration: 30 * 1000,
    id: ctx => `/maps/uploader/${ctx.params.id}:${ctx.realIP}`,
    max: 90,
  }),
  cache({ prefix: ctx => `uploader:${ctx.params.id}:`, expire: 60 * 10 }),
  async ctx => {
    try {
      const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
      const maps = await paginate(
        Beatmap,
        { uploader: ctx.params.id, deletedAt: null },
        { page, sort: '-uploaded', populate: 'uploader', projection: '-votes' }
      )

      return (ctx.body = maps)
    } catch (err) {
      if (err.name === 'CastError') return (ctx.status = 404)
      else throw err
    }
  }
)

export { router as mapsRouter }
