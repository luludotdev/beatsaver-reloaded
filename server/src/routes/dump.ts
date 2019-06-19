import Router from 'koa-router'
import { rateLimit } from '../middleware/ratelimit'
import Beatmap from '../mongo/models/Beatmap'
import { jsonStream } from '../utils/streams'

const router = new Router({
  prefix: '/dump',
})

router.get('/maps', rateLimit(1000 * 60 * 60 * 12, 10), async ctx => {
  const maps = Beatmap.find({}, '-votes')
    .sort({ uploaded: -1 })
    .populate('uploader')
    .cursor()
    .pipe(jsonStream())

  return (ctx.body = maps)
})

export { router as dumpRouter }
