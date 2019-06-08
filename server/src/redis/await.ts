import { cacheDB, rateLimitDB } from './db'

export const awaitCacheDB = () =>
  new Promise(resolve => {
    if (cacheDB.status === 'ready') return resolve()

    cacheDB.on('ready', () => resolve())
  })

export const awaitRateLimitDB = () =>
  new Promise(resolve => {
    if (rateLimitDB.status === 'ready') return resolve()
    else rateLimitDB.on('ready', () => resolve())
  })
