import mongoose from 'mongoose'
import { IS_DEV, MONGO_URL, PORT } from './env'
import { app } from './koa'
import './strategies'
import signale, { panic } from './utils/signale'

if (IS_DEV) signale.warn('Running in development environment!')
mongoose.set('useCreateIndex', true)
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(async () => {
    signale.info(`Connected to MongoDB ${IS_DEV ? 'Instance' : 'Cluster'}`)

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
