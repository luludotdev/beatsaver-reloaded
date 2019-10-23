import { schedule } from 'node-cron'
import * as schemas from '~utils/schemas'

schedule('0 */1 * * *', async () => schemas.sync())
