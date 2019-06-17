import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import koaStatic from 'koa-static'
import mongoose from 'mongoose'
import { parse } from 'path'
import { MONGO_URL, PORT } from './env'
import { htmlPath, root } from './generateHTML'
import { middleware } from './middleware'
import signale, { panic } from './signale'

const app = new Koa()
const router = new Router()

app.use(
  koaStatic(root, {
    setHeaders: (req, path) => {
      const { ext } = parse(path)
      const allowed = [
        '.css',
        '.js',
        '.map',
        '.png',
        '.jpg',
        '.jpeg',
        '.svg',
        '.gif',
      ]

      if (allowed.includes(ext)) {
        req.setHeader('Cache-Control', 'public, max-age=31536000')
      }
    },
  })
)

router.get('/beatmap/:key', middleware)
router.get('*', async ctx => send(ctx, htmlPath, { root: '/', maxAge: -1 }))

mongoose.set('useCreateIndex', true)
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    app
      .use(router.routes())
      .use(router.allowedMethods())
      .listen(PORT)
      .on('listening', () => {
        signale.start(`Listening over HTTP on port ${PORT}`)
      })
  })
  .catch(err => {
    signale.fatal(`Failed to connect to MongoDB!`)
    return panic(err)
  })
