import { Middleware } from 'koa'
import { MongoError } from 'mongodb'
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
    } else if (err instanceof MongoError) {
      if (err.code === 11000) {
        const body = {
          code: 0x00002,
          identifier: 'ERR_DUPLICATE_RESOURCE',
        }

        ctx.status = 422
        return (ctx.body = body)
      }

      throw err
    } else if (err instanceof CodedError) {
      ctx.status = err.status
      return (ctx.body = err.body)
    }

    throw err
  }
}
