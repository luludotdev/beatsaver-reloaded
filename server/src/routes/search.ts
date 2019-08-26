import cors from '@koa/cors'
import Router from 'koa-router'
import {ISearchResponse} from 'mongoose'
import {ELASTIC_DISABLED, RESULTS_PER_PAGE} from '../env'
import {rateLimit} from '../middleware/ratelimit'
import Beatmap from '../mongo/models/Beatmap'
import CodedError from '../utils/CodedError'

const router = new Router({
  prefix: '/search',
})
  .use((ctx, next) => {
    if (ELASTIC_DISABLED) return (ctx.status = 501)
    else return next()
  })
  .use(cors())

const ERR_NO_QUERY = new CodedError(
  'no query parameter specified',
  0x20001,
  'ERR_NO_QUERY',
  400
)

interface IQueryField {
  key: string
  fuzzy?: boolean
  distance?: number
  boost?: number
}

const buildQuery = (query: string, fields: IQueryField[]) =>
  fields
    .map(({key, fuzzy, distance, boost}) => {
      const fz = fuzzy ? `~${distance || 1}` : ''
      const bo = boost ? `^${boost}` : ''

      const escapeRX = /(&&|\|\||[+\-!(){}[\]^~*?:\\])/g
      const escaped = query.replace(escapeRX, '\\$1')

      return `${key}:${escaped}${fz}${bo}`
    })
    .join(' ')

const elasticSearch = async (query: any, page: number = 0, sort?: object | null) => {
  const searchPromise: <T>() => Promise<ISearchResponse<T>> = () =>
    new Promise((resolve, reject) => {
      Beatmap.esSearch(
        {
          from: RESULTS_PER_PAGE * page,
          query,
          size: RESULTS_PER_PAGE,
        }, {
          sort: sort
        },
        (err, r) => {
          //signale.debug(util.inspect(r, false, null, true));
          if (err) return reject(err)
          return resolve(r)
        }
      )
    })

  const {
    hits: {
      total: {value: totalDocs},
      hits,
    },
  } = await searchPromise()

  const lastPage = Math.floor(totalDocs / RESULTS_PER_PAGE)
  const prevPage = page - 1 === -1 ? null : page - 1
  const nextPage = page + 1 > lastPage ? null : page + 1

  const IDsOnly = hits.map((h) => h._id)
  const IDs = hits.map(({_id, _score}) => ({_id, _score}))
  const maps = await Beatmap.find({_id: {$in: IDs}}, '-votes')
  const docs = maps
    .map(map => {
      const result = IDs.find(x => x._id.toString() === map._id.toString())
      const score = (result && result._score) || 0

      return {map, score}
    })
    .sort((a, b) => {

      const aPos = IDsOnly.indexOf(a.map._id.toString())
      const bPos = IDsOnly.indexOf(b.map._id.toString())

      return aPos - bPos

    } )
    .map(({map}) => map)

  await Promise.all(docs.map(d => d.populate('uploader').execPopulate()))

  return {docs: docs, totalDocs, lastPage, prevPage, nextPage}
}

router.get(
  '/text/:page?',
  rateLimit({
    duration: 5 * 1000,
    id: ctx => `/search/text:${ctx.realIP}`,
    max: 25,
  }),
  async ctx => {
    const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
    const q = ctx.query.q
    if (!q) throw ERR_NO_QUERY

    const fields: IQueryField[] = [
      {key: 'name', fuzzy: true, boost: 2},
      {key: 'name', boost: 3},
      {key: 'uploader.username', fuzzy: true, boost: 1.5},
      {key: 'uploader.username', boost: 2},
      {key: 'metadata.songName', fuzzy: true},
      {key: 'metadata.songName', boost: 1.5},
      {key: 'metadata.songSubName', fuzzy: true},
      {key: 'metadata.songAuthorName', fuzzy: true},
      {key: 'metadata.songAuthorName', boost: 1.5},
      {key: 'metadata.levelAuthorName', fuzzy: true},
      {key: 'metadata.levelAuthorName', boost: 1.5},
      {key: 'hash', boost: 5},
    ]

    const query = buildQuery(q, fields)
    const resp = await elasticSearch(
      {
        bool: {
          //must: { query_string: { query } },
          must: {query_string: {query: q}},
          must_not: {
            exists: {field: 'deletedAt'},
          },
        },
      },
      page
    )

    return (ctx.body = resp)
  }
)

router.get(
  '/advanced/:page?',
  rateLimit({
    duration: 5 * 1000,
    id: ctx => `/search/advanced:${ctx.realIP}`,
    max: 15,
  }),
  async ctx => {
    const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
    const query = ctx.query.q
    const timeframe: number = +ctx.query.timeframe
    const sortBy: number = +ctx.query.sortBy
    let difficulty = ctx.query.difficulty

    if (!query) throw ERR_NO_QUERY

    if (!query) {
      return
    }

    let q = {
      bool: {
        must: {query_string: {query}},
        must_not: {
          exists: {field: 'deletedAt'},
        },
        filter: [] as Object[],
      },
    };

    let sort: object | null = null

    if (!Array.isArray(difficulty)) {
      difficulty = difficulty ? [difficulty] : []
    }

    if (difficulty && difficulty.length > 0) {

      difficulty.forEach((dif: string) => {

        const filter = {
          term: {
            ["metadata.difficulties." + dif]: true
          }
        };

        q.bool.filter.push(filter)

      })

    }

    // Timeframe == 4 => All time; no filtering is required
    if (timeframe < 4) {

      const today = new Date()
      let tf = new Date()

      // For some reason, if I set the date to 1 in new Date(), the day turns into 31 instead of 01
      switch (timeframe) {
        // Past 24 hours
        case 0:
          tf = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 1)
          break
        // Past week
        case 1:
          const day = today.getDay()
          const diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          tf = new Date(tf.setDate(diff));
          break
        // Past month
        case 2:
          tf = new Date(today.getFullYear(), today.getMonth(), 2)
          break
        // Past year
        case 3:
          tf = new Date(today.getFullYear(), 0, 2)
          break
      }

      const filter = {
        range: {
          uploaded: {
            gte: tf.toISOString().slice(0, 10)
          }
        }
      };

      q.bool.filter.push(filter)

    }

    if (sortBy >= 0) {

      switch (sortBy) {
        case 0:
          sort = {
            "stats.downloads": "asc"
          }
          break
        case 1:
          sort = {
            "stats.downloads": "desc"
          }
          break
        case 2:
          sort = {
            "stats.rating": "asc"
          }
          break
        case 3:
          sort = {
            "stats.rating": "desc"
          }
          break
        case 4:
          sort = {
            "stats.plays": "asc"
          }
          break
        case 5:
          sort = {
            "stats.plays": "desc"
          }
          break
      }

    }

    const resp = await elasticSearch(q, page, sort)

    return (ctx.body = resp)
  }
)

export {router as searchRouter}
