import Redis from 'ioredis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '~environment'
import signale from '~utils/signale'
import { CACHE_DB, RATE_LIMIT_DB } from './constants'

export const rateLimitDB = new Redis({
  db: RATE_LIMIT_DB,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  port: REDIS_PORT,
})

rateLimitDB
  .on('ready', () => signale.info('Connected to Ratelimit KV Store'))
  .on('reconnecting', () =>
    signale.warn('Reconnecting to Ratelimit KV Store...')
  )
  .on('error', () => {
    signale.error('Failed to connect to Ratelimit KV Store')
    process.exit(1)
  })

export const cacheDB = new Redis({
  db: CACHE_DB,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  port: REDIS_PORT,
})

cacheDB
  .on('ready', () => signale.info('Connected to Cache KV Store'))
  .on('reconnecting', () => signale.warn('Reconnecting to Cache KV Store...'))
  .on('error', () => {
    signale.error('Failed to connect to Cache KV Store')
    process.exit(1)
  })
