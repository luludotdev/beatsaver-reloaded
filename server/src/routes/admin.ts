import passport from 'koa-passport'
import Router from 'koa-router'
import Beatmap from '../mongo/models/Beatmap'
import { IUserModel } from '../mongo/models/User'

const router = new Router({
  prefix: '/admin',
})

router.post(
  '/migrate-votes',
  passport.authenticate('jwt', { session: false }),
  ctx =>
    new Promise((resolve, reject) => {
      const user: IUserModel = ctx.state.user
      if (!user.admin) return resolve((ctx.status = 401))

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

export { router as adminRouter }
