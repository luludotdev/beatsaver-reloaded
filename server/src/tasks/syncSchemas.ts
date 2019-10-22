import { schedule } from 'node-cron'
import * as schemas from '~utils/schemas'
import signale from '~utils/signale'

const syncSchemas = () => {
  signale.start('Syncing schemas...')
  schemas.sync().then(() => {
    signale.complete('Schema sync complete!')
  })
}

schedule('0 */1 * * *', async () => syncSchemas())
