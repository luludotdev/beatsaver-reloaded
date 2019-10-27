import 'source-map-support/register'

import mongoose from 'mongoose'
import { SCHEMA_DIFFICULTY, SCHEMA_INFO } from '~constants'
import {
  ELASTIC_DISABLED,
  ELASTIC_HOST,
  ELASTIC_PORT,
  IS_DEV,
  MONGO_URL,
  PORT,
} from '~environment'
import { awaitCacheDB, awaitRateLimitDB } from '~redis'
import '~strategies'
import axios from '~utils/axios'
import * as schemas from '~utils/schemas'
import signale, { panic } from '~utils/signale'
import { app } from './koa'
import './tasks'

if (IS_DEV) signale.warn('Running in development environment!')

mongoose
  .connect(MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    signale.info(`Connected to MongoDB ${IS_DEV ? 'Instance' : 'Cluster'}`)
    return Promise.all([awaitCacheDB(), awaitRateLimitDB()])
  })
  .then(() => {
    try {
      if (!ELASTIC_DISABLED) {
        axios.get(`http://${ELASTIC_HOST}:${ELASTIC_PORT}`)
        signale.info('Connected to Elasticsearch instance!')
      }
    } catch (err) {
      signale.fatal('Failed to connect to Elasticsearch!')
      process.exit(1)
    }
  })
  .then(() =>
    Promise.all([
      schemas.register(SCHEMA_INFO),
      schemas.register(SCHEMA_DIFFICULTY),
    ])
  )
  .then(() => {
    app.listen(PORT).on('listening', () => {
      signale.start(`Listening over HTTP on port ${PORT}`)
    })
  })
  .catch(err => {
    signale.fatal(
      `Failed to connect to MongoDB ${IS_DEV ? 'Instance' : 'Cluster'}!`
    )

    return panic(err)
  })
