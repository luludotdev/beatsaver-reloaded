import Router from 'koa-router'
import { authRouter } from './auth'
import { mapsRouter } from './maps'
import { searchRouter } from './search'
import { uploadRouter } from './upload'

export const routes: Router[] = [
  authRouter,
  mapsRouter,
  searchRouter,
  uploadRouter,
]
