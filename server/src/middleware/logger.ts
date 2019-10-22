import { Middleware } from 'koa'
import signale from '~utils/signale'

export const logger: Middleware = async (ctx, next) => {
  await next()

  const httpVersion = `${ctx.req.httpVersionMajor}.${ctx.req.httpVersionMinor}`

  const responseLength = ctx.status === 204 ? 0 : ctx.response.length || -1
  const reqInfo = `${ctx.method} ${ctx.url} HTTP/${httpVersion}`
  const resInfo = `${ctx.status} ${responseLength}`
  const referrer = ctx.headers.referer || ctx.headers.referrer || '-'
  const ua = ctx.headers['user-agent'] || '-'
  const headers = `"${referrer}" "${ua}"`

  signale.info(`${ctx.realIP} - "${reqInfo}" ${resInfo} ${headers}`)
}
