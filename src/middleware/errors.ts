import { Middleware } from 'koa'
import CodedError from '../utils/CodedError'

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors: any[] = Object.values(err.errors)
      const fields = errors.map(({ path, value, kind }) => ({
        kind,
        path,
        value,
      }))

      const body = { code: 0x00001, identifier: 'ERR_INVALID_FIELDS', fields }

      ctx.status = 400
      return (ctx.body = body)
    } else if (err instanceof CodedError) {
      ctx.status = err.status
      return (ctx.body = err.body)
    }

    throw err
  }
}
