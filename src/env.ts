const { NODE_ENV } = process.env

const IS_PROD =
  NODE_ENV !== undefined && NODE_ENV.toLowerCase() !== 'production'
export const IS_DEV = !IS_PROD

const dbName = 'beatsaver'
export const MONGO_URL = IS_DEV
  ? `mongodb://localhost:27017/${dbName}`
  : `mongodb://mongodb-0.mongodb:27017/${dbName}`

const defaultPort = 3000
export const PORT =
  parseInt(process.env.PORT || `${defaultPort}`, 10) || defaultPort
