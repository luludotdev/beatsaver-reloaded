import dotenv from 'dotenv'
import signale, { panic } from '~utils/signale'

dotenv.config()
const { NODE_ENV } = process.env

const required = ['JWT_SECRET', 'STEAM_API_KEY', 'MAIL_FROM']

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

export const STEAM_API_KEY = process.env.STEAM_API_KEY as string

const IS_PROD =
  NODE_ENV !== undefined && NODE_ENV.toLowerCase() === 'production'
export const IS_DEV = !IS_PROD

const dbName = 'beatsaver'
export const MONGO_URL =
  process.env.MONGO_URL || IS_DEV
    ? `mongodb://localhost:27017/${dbName}`
    : `mongodb://mongo:27017/${dbName}`

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
export const REDIS_HOST =
  process.env.REDIS_HOST || (IS_DEV ? 'localhost' : 'redis')

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_PORT =
  parseInt(process.env.REDIS_PORT || `${redisPort}`, 10) || redisPort

const elasticPort = 9200
export const ELASTIC_DISABLED = process.env.ELASTIC_DISABLED === 'true'
export const ELASTIC_HOST =
  process.env.ELASTIC_HOST || (IS_DEV ? 'localhost' : 'elastic')

export const ELASTIC_PORT =
  parseInt(process.env.ELASTIC_PORT || `${elasticPort}`, 10) || elasticPort

export type MailDriver = 'sendgrid' | 'log'
export const MAIL_DRIVER = (process.env.MAIL_DRIVER || 'log') as MailDriver
if (MAIL_DRIVER === 'log') {
  signale.warn(
    'Mail driver is set to logs only! This is not recommended for production.'
  )
}

export const MAIL_FROM = process.env.MAIL_FROM as string
export const SENDGRID_KEY = process.env.SENDGRID_KEY as string

try {
  const sendgridVars = ['SENDGRID_KEY']

  for (const variable of sendgridVars) {
    if (MAIL_DRIVER === 'log') break
    if (!process.env[variable]) throw new Error(variable)
  }
} catch (err) {
  panic(`Missing environment variable ${err.message}`)
}

export const DISABLE_DUMPS: boolean =
  process.env.DISABLE_DUMPS === 'true' || false
