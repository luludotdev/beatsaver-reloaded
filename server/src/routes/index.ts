import Router from 'koa-router'
import { authRouter } from './auth'
import { mapsRouter } from './maps'

export const routes: Router[] = [authRouter, mapsRouter]
