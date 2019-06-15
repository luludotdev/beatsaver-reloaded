import cors from '@koa/cors'
import Router from 'koa-router'
import { ISearchResponse } from 'mongoose'
import { RESULTS_PER_PAGE } from '../env'
import { rateLimit } from '../middleware/ratelimit'
import Beatmap from '../mongo/models/Beatmap'
import CodedError from '../utils/CodedError'

const router = new Router({
  prefix: '/search',
}).use(cors())

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
    .map(({ key, fuzzy, distance, boost }) => {
      const fz = fuzzy ? `~${distance || 1}` : ''
      const bo = boost ? `^${boost}` : ''

      const escapeRX = /(&&|\|\||[+\-!(){}[\]^"~*?:\\])/
      const escaped = query.replace(escapeRX, '\\$1')

      return `${key}:${escaped}${fz}${bo}`
    })
    .join(' ')

const elasticSearch = async (query: any, page: number = 0) => {
  const searchPromise: <T>() => Promise<ISearchResponse<T>> = () =>
    new Promise((resolve, reject) => {
      Beatmap.esSearch(
        {
          from: RESULTS_PER_PAGE * page,
          query,
          size: RESULTS_PER_PAGE,
        },
        (err, r) => {
          if (err) return reject(err)
          return resolve(r)
        }
      )
    })

  const {
    hits: {
      total: { value: totalDocs },
      hits,
    },
  } = await searchPromise()

  const lastPage = Math.floor(totalDocs / RESULTS_PER_PAGE)
  const prevPage = page - 1 === -1 ? null : page - 1
  const nextPage = page + 1 > lastPage ? null : page + 1

  const IDs = hits.map(({ _id, _score }) => ({ _id, _score }))
  const maps = await Beatmap.find({ _id: { $in: IDs } }, '-votes')
  const docs = maps
    .map(map => {
      const result = IDs.find(x => x._id.toString() === map._id.toString())
      const score = (result && result._score) || 0

      return { map, score }
    })
    .sort((a, b) => b.score - a.score)
    .map(({ map }) => map)

  return { docs, totalDocs, lastPage, prevPage, nextPage }
}

router.get('/text/:page?', rateLimit(1 * 1000, 2), async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const q = ctx.query.q
  if (!q) throw ERR_NO_QUERY

  const fields: IQueryField[] = [
    { key: 'name', fuzzy: true, boost: 2 },
    { key: 'metadata.songName', fuzzy: true },
    { key: 'metadata.songSubName', fuzzy: true },
    { key: 'metadata.songAuthorName', fuzzy: true },
    { key: 'metadata.levelAuthorName', fuzzy: true },
    { key: 'hash', boost: 5 },
  ]

  const query = buildQuery(q, fields)
  const resp = await elasticSearch({ query_string: { query } }, page)

  return (ctx.body = resp)
})

router.get('/advanced/:page?', rateLimit(1 * 1000, 1), async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const query = ctx.query.q
  if (!query) throw ERR_NO_QUERY

  const resp = await elasticSearch({ query_string: { query } }, page)
  return (ctx.body = resp)
})

export { router as searchRouter }
