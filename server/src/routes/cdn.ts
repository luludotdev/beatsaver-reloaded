import Router from 'koa-router'
import { Serve as serve } from 'static-koa-router'
import { CDN_PATH } from '~constants'

const router = new Router({
  prefix: '/cdn',
})

serve(CDN_PATH, router, {
  maxage: 86400000 // Cache downloads for 24 hours
})
export { router as cdnRouter }
