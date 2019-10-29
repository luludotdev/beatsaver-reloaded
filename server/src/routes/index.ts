import Router from 'koa-router'
import { IS_DEV } from '~environment'
import signale from '~utils/signale'
import { adminRouter } from './admin'
import { authRouter } from './auth'
import { cdnRouter } from './cdn'
import { downloadRouter } from './download'
import { legalRouter } from './legal'
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
  legalRouter,
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
