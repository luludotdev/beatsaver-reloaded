import Router from 'koa-router'
import { IS_DEV } from '../env'
import signale from '../utils/signale'
import { adminRouter } from './admin'
import { authRouter } from './auth'
import { cdnRouter } from './cdn'
import { downloadRouter } from './download'
import { manageRouter } from './manage'
import { mapsRouter } from './maps'
import { searchRouter } from './search'
import { statsRouter } from './stats'
import { uploadRouter } from './upload'
import { usersRouter } from './users'
import { voteRouter } from './vote'

export const routes: Router[] = [
  adminRouter,
  authRouter,
  downloadRouter,
  manageRouter,
  mapsRouter,
  searchRouter,
  statsRouter,
  uploadRouter,
  usersRouter,
  voteRouter,
]

if (IS_DEV) {
  signale.warn('Enabling local CDN... Do not use this in production!')
  routes.push(cdnRouter)
}
