import passport from 'koa-passport'
import Router from 'koa-router'
import { Beatmap, IUserModel } from '~mongo/models'
import { cacheDB, rateLimitDB } from '~redis'
import * as schemas from '~utils/schemas'
import signale from '~utils/signale'

const router = new Router({
  prefix: '/admin',
})

router.use(passport.authenticate('jwt', { session: false }))
router.use(async (ctx, next) => {
  const user: IUserModel = ctx.state.user
  if (!user.admin) return (ctx.status = 401)

  await next()
})

router.post(
  '/migrate-votes',
  ctx =>
    new Promise((resolve, reject) => {
      Beatmap.find({ 'stats.upVotes': { $exists: false } })
        .cursor()
        .on('data', doc =>
          doc.save().then(() => {
            // No-op
          })
        )
        .on('end', () => resolve((ctx.status = 204)))
        .on('error', err => reject(err))
    })
)

const elasticSync = (force?: boolean) =>
  new Promise(async (resolve, reject) => {
    const truncate = () =>
      new Promise((r, rj) => {
        Beatmap.esTruncate(err => {
          if (err) rj(err)
          else r()
        })
      })

    signale.start('Starting elasticsearch sync...')
    if (force) await truncate()

    let count = 0
    Beatmap.synchronize()
      .on('data', () => {
        count++
      })
      .on('close', () => {
        signale.complete('Elasticsearch sync complete!')
        resolve(count)
      })
      .on('error', err => reject(err))
  })

router.post('/elastic-sync/:force?', async ctx => {
  const force = !!ctx.params.force
  ctx.status = 204

  elasticSync(force)
})

router.post('/sync-schemas', async ctx => {
  await schemas.sync()
  return (ctx.status = 204)
})

router.post('/flush-cache', async ctx => {
  await cacheDB.flushdb()
  return (ctx.status = 204)
})

router.post('/reset-rate-limits', async ctx => {
  await rateLimitDB.flushdb()
  return (ctx.status = 204)
})

export { router as adminRouter }
