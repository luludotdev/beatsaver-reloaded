import Router from 'koa-router'
import Song from '../mongo/models/Song'

const router = new Router({
  prefix: '/api/v1.0',
})

router.get('/songs', async ctx => {
  const songs = await Song.find({})
  return (ctx.body = songs)
})

export { router as apiRouter }
