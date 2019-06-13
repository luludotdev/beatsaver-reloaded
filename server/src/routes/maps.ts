import chunk from 'chunk'
import Router from 'koa-router'
import { RESULTS_PER_PAGE } from '../env'
import { cache } from '../middleware/cache'
import Beatmap from '../mongo/models/Beatmap'
import { paginate } from '../mongo/plugins/paginate'
import { parseKey } from '../utils/parseKey'

const router = new Router({
  prefix: '/maps',
})

const mapCache = cache({ prefix: 'maps', expire: 60 * 10 })

router.get('/latest/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-uploaded', populate: 'uploader', projection: '-votes' }
  )

  return (ctx.body = maps)
})

router.get('/downloads/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    {
      page,
      populate: 'uploader',
      projection: '-votes',
      sort: '-stats.downloads -uploaded',
    }
  )

  return (ctx.body = maps)
})

router.get('/plays/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    {
      page,
      populate: 'uploader',
      projection: '-votes',
      sort: '-stats.plays -uploaded',
    }
  )

  return (ctx.body = maps)
})

router.get('/hot/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-stats.heat', populate: 'uploader', projection: '-votes' }
  )

  return (ctx.body = maps)
})

router.get('/rating/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-stats.rating', populate: 'uploader', projection: '-votes' }
  )

  return (ctx.body = maps)
})

router.get(
  '/detail/:key',
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
  cache({ prefix: ctx => `uploader:${ctx.params.id}:`, expire: 60 * 10 }),
  async ctx => {
    const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
    const maps = await paginate(
      Beatmap,
      { uploader: ctx.params.id, deletedAt: null },
      { page, sort: '-uploaded', populate: 'uploader', projection: '-votes' }
    )

    return (ctx.body = maps)
  }
)

export { router as mapsRouter }
