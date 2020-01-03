import { Middleware } from 'koa'
import redisCache, { CacheOptions } from 'koa-redis-cache'
import {
  CACHE_DRIVER,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '~environment'
import { CACHE_DB, cacheDB } from '~redis'

const noCache: Middleware = (_, next) => next()

export async function getCache(key: string) {
  const stat = await cacheDB.get(key)
  return stat
}

export async function setCache(key: string, map: string, expire: number) {
  const result = await cacheDB.set(key, map, 'EX', expire)
  return result
}

export async function delCache(key: string) {
  const result = await cacheDB.del(key)
  return result
}

export const cache = (opts?: CacheOptions) => {
  if (CACHE_DRIVER !== 'redis') return noCache

  const options: CacheOptions = {
    expire: 10 * 60,

    ...opts,

    prefix:
      opts && opts.prefix
        ? typeof opts.prefix === 'string'
          ? `${opts.prefix}:`
          : opts.prefix
        : undefined,

    redis: {
      host: REDIS_HOST,
      options: {
        db: CACHE_DB,
        password: REDIS_PASSWORD,
      },
      port: REDIS_PORT,
    },
  }

  return redisCache(options)
}

export const cacheHeaders: Middleware = async (ctx, next) => {
  await next()

  ctx.set(
    'X-Cache-Status',
    ctx.response.headers['x-koa-redis-cache'] === 'true' ? 'HIT' : 'MISS'
  )

  ctx.remove('X-Koa-Redis-Cache')
}

export const clearCache: (prefix?: string) => Promise<void> = (
  prefix = 'koa-redis-cache'
) =>
  new Promise((resolve, reject) => {
    try {
      const keys: string[] = []
      const stream = cacheDB.scanStream({ match: `${prefix}:*` })
      stream
        .on('data', (k: string[]) => keys.push(...k))
        .on('end', async () => {
          const pipeline = cacheDB.pipeline()

          for (const key of keys) {
            pipeline.del(key)
          }

          try {
            await pipeline.exec()
            resolve()
          } catch (err) {
            return reject(err)
          }
        })
        .on('error', err => reject(err))
    } catch (err) {
      reject(err)
    }
  })
