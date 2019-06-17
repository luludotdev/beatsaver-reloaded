import dotenv from 'dotenv'

dotenv.config()
const { NODE_ENV } = process.env

const IS_PROD =
  NODE_ENV !== undefined && NODE_ENV.toLowerCase() === 'production'
export const IS_DEV = !IS_PROD

const dbName = 'beatsaver'
export const MONGO_URL =
  process.env.MONGO_URL || IS_DEV
    ? `mongodb://localhost:27017/${dbName}`
    : `mongodb://mongo:27017/${dbName}`

const defaultPort = 1234
export const PORT =
  parseInt(process.env.PORT || `${defaultPort}`, 10) || defaultPort
