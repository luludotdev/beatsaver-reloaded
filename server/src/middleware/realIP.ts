import { Middleware } from 'koa'

declare module 'koa' {
  // tslint:disable-next-line: interface-name
  interface ContextDelegatedRequest {
    realIP: string
  }
}

export const realIP: Middleware = async (ctx, next) => {
  ctx.realIP =
    ctx.headers['cf-connecting-ip'] || ctx.headers['x-forwarded-for'] || ctx.ip

  return next()
}
