import Router from 'koa-router'
import { Serve as serve } from 'static-koa-router'
import { CDN_PATH } from '~constants'

const router = new Router({
  prefix: '/cdn',
})

serve(CDN_PATH, router)
export { router as cdnRouter }
