import cors from '@koa/cors'
import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import { join } from 'path'
import { LEGAL_PATH } from '~constants'
import { cache, rateLimit } from '~middleware'
import { exists, readFile } from '~utils/fs'

const router = new Router({
  prefix: '/legal',
})
  .use(cors())
  .use(
    rateLimit({
      duration: 10 * 1000,
      max: 200,
    })
  )
  .use(cache({ prefix: 'legal', expire: 60 * 15 }))

const serveMiddleware = async (ctx: ParameterizedContext, path: string) => {
  const fileExists = await exists(path)
  if (fileExists === false) return (ctx.status = 501)

  const content = await readFile(path, 'utf8')
  if (content.trim() === '') return (ctx.status = 501)

  return (ctx.body = content.trim())
}

router.get('/dmca', async ctx => {
  const dmcaPath = join(LEGAL_PATH, 'DMCA.md')
  return serveMiddleware(ctx, dmcaPath)
})

router.get('/privacy', async ctx => {
  const dmcaPath = join(LEGAL_PATH, 'PRIVACY.md')
  return serveMiddleware(ctx, dmcaPath)
})

export { router as legalRouter }
