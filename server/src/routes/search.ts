import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'
import { paginate } from '../mongo/plugins/paginate'
import CodedError from '../utils/CodedError'

const router = new Router({
  prefix: '/search',
})

const ERR_NO_QUERY = new CodedError(
  'no query parameter specified',
  0x20001,
  'ERR_NO_QUERY',
  400
)

router.get('/text/:page?', async ctx => {
  const page = Math.max(0, Number.parseInt(ctx.params.page, 10)) || 0
  const query = ctx.query.q
  if (!query) throw ERR_NO_QUERY

  const maps = await paginate(
    Beatmap,
    { $text: { $search: query } },
    { page, sort: '-stats.downloads', populate: 'uploader' }
  )

  return (ctx.body = { maps: maps.docs, ...maps, docs: undefined })
})

export { router as searchRouter }
