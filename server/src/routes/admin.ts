import passport from 'koa-passport'
import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'
import { IUserModel } from '../mongo/models/User'
import signale from '../utils/signale'

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

export { router as adminRouter }
