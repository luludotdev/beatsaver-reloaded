import Redis from 'ioredis'
import { Middleware } from 'koa'
import redisCache, { CacheOptions } from 'koa-redis-cache'
import { CACHE_DRIVER, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../env'

const noCache: Middleware = (_, next) => next()

export const cache = (opts?: CacheOptions) => {
  if (CACHE_DRIVER !== 'redis') return noCache

  setTimeout(() => {
    clearCache()
  }, 2000)

  const options: CacheOptions = {
    expire: 10 * 60,

    ...opts,

    prefix: opts && opts.prefix ? `${opts.prefix}:` : undefined,

    redis: {
      host: REDIS_HOST,
      options: {
        password: REDIS_PASSWORD,
      },
      port: REDIS_PORT,
    },
  }

  return redisCache(options)
}

export const clearCache: (prefix?: string) => Promise<void> = (
  prefix = 'koa-redis-cache'
) =>
  new Promise((resolve, reject) => {
    if (CACHE_DRIVER !== 'redis') return resolve()

    const redis = new Redis({
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
      port: REDIS_PORT,
    })

    const keys: string[] = []
    const stream = redis.scanStream({ match: `${prefix}:*` })
    stream
      .on('data', (k: string[]) => keys.push(...k))
      .on('end', async () => {
        const pipeline = redis.pipeline()

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
  })
