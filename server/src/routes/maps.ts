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
    { page, sort: '-uploaded', populate: 'uploader' }
  )

  return (ctx.body = maps)
})

router.get('/downloads/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-stats.downloads -uploaded', populate: 'uploader' }
  )

  return (ctx.body = maps)
})

router.get('/plays/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const maps = await paginate(
    Beatmap,
    { deletedAt: null },
    { page, sort: '-stats.plays -uploaded', populate: 'uploader' }
  )

  return (ctx.body = maps)
})

router.get('/hot/:page?', mapCache, async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0

  interface IResult {
    _id: string
    score: number
  }

  // Reddit Hot Algorithm
  const IDs: IResult[] = await Beatmap.aggregate([
    { $match: { deletedAt: null } },
    {
      $project: {
        _id: '$_id',
        downVotes: {
          $filter: {
            as: 'vote',
            cond: { $eq: ['$$vote.direction', -1] },
            input: '$votes',
          },
        },
        seconds: {
          $subtract: [
            {
              $divide: [
                { $subtract: ['$uploaded', new Date(Date.UTC(1970, 0, 1))] },
                1000,
              ],
            },
            1525132800,
          ],
        },
        upVotes: {
          $filter: {
            as: 'vote',
            cond: { $eq: ['$$vote.direction', 1] },
            input: '$votes',
          },
        },
      },
    },
    {
      $project: {
        _id: '$_id',
        downVotes: { $size: '$downVotes' },
        seconds: '$seconds',
        upVotes: { $size: '$upVotes' },
      },
    },
    {
      $project: {
        _id: '$_id',
        score: { $subtract: ['$upVotes', '$downVotes'] },
        seconds: '$seconds',
      },
    },
    {
      $project: {
        _id: '$_id',
        absolute: { $abs: '$score' },
        score: '$score',
        seconds: '$seconds',
        sign: {
          $cond: {
            else: {
              $cond: { if: { $lt: ['$score', 0] }, then: -1, else: 0 },
            },
            if: { $gt: ['$score', 0] },
            then: 1,
          },
        },
      },
    },
    {
      $project: {
        _id: '$_id',
        order: { $log10: { $max: ['$absolute', 1] } },
        seconds: '$seconds',
        sign: '$sign',
      },
    },
    {
      $project: {
        score: {
          $add: [
            { $multiply: ['$sign', '$order'] },
            { $divide: ['$seconds', 45000] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
  ])

  const totalDocs = IDs.length
  const objectIDs = chunk(IDs, RESULTS_PER_PAGE)

  const lastPage = objectIDs.length - 1
  const prevPage = page - 1 === -1 ? null : page - 1
  const nextPage = page + 1 > lastPage ? null : page + 1

  const currentPage = objectIDs[page] || []
  const maps = await Beatmap.find({ _id: { $in: currentPage } })
  const docs = maps
    .map(map => {
      const result = IDs.find(x => x._id.toString() === map._id.toString())
      const score = (result && result.score) || 0

      return { map, score }
    })
    .sort((a, b) => b.score - a.score)
    .map(({ map }) => map)

  await Promise.all(docs.map(d => d.populate('uploader').execPopulate()))
  return (ctx.body = { docs, totalDocs, lastPage, prevPage, nextPage })
})

router.get(
  '/detail/:key',
  cache({ prefix: ctx => `key:${ctx.params.key}:`, expire: 60 * 10 }),
  async ctx => {
    const key = parseKey(ctx.params.key)
    if (key === false) return (ctx.status = 404)

    const map = await Beatmap.findOne({ key, deletedAt: null })
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

    const map = await Beatmap.findOne({
      deletedAt: null,
      hash: ctx.params.hash.toLowerCase(),
    })

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
      { page, sort: '-uploaded', populate: 'uploader' }
    )

    return (ctx.body = maps)
  }
)

export { router as mapsRouter }
