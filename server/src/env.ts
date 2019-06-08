import dotenv from 'dotenv'
import signale, { panic } from './utils/signale'

dotenv.config()
const { NODE_ENV } = process.env

const required = ['JWT_SECRET']

try {
  for (const variable of required) {
    if (!process.env[variable]) throw new Error(variable)
  }
} catch (err) {
  panic(`Missing environment variable ${err.message}`)
}

export const JWT_SECRET = process.env.JWT_SECRET as string
if (JWT_SECRET.length < 32) {
  signale.warn('JWT Secret does not meet security recommendations!')
}

const IS_PROD =
  NODE_ENV !== undefined && NODE_ENV.toLowerCase() !== 'production'
export const IS_DEV = !IS_PROD

const dbName = 'beatsaver'
export const MONGO_URL =
  process.env.MONGO_URL || IS_DEV
    ? `mongodb://localhost:27017/${dbName}`
    : `mongodb://mongodb-0.mongodb:27017/${dbName}`

const defaultPort = 3000
export const PORT =
  parseInt(process.env.PORT || `${defaultPort}`, 10) || defaultPort

const defaultRounds = 12
export const BCRYPT_ROUNDS =
  parseInt(process.env.BCRYPT_ROUNDS || `${defaultRounds}`, 10) || defaultRounds

const defaultResultsPerPage = 10
export const RESULTS_PER_PAGE =
  parseInt(process.env.RESULTS_PER_PAGE || `${defaultResultsPerPage}`, 10) ||
  defaultResultsPerPage

export const CACHE_DRIVER = (process.env.CACHE_DRIVER || 'none') as
  | 'redis'
  | 'none'

if (CACHE_DRIVER === 'none') {
  signale.warn(
    'Route caching is disabled! This is not recommended for production.'
  )
}

const redisPort = 6379
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_PORT =
  parseInt(process.env.REDIS_PORT || `${redisPort}`, 10) || redisPort
