import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import { JWT_SECRET } from '../env'
import User from '../mongo/models/User'

export interface IAuthToken {
  _id: string
  username: string
  admin: boolean

  issued: string | Date
  expires: string | Date
}

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload: IAuthToken, cb) => {
      const expires = new Date(payload.expires)
      if (new Date() >= expires) return cb(null, false)

      try {
        const user = await User.findById(payload._id)
        if (!user) return cb(null, false)

        return cb(null, user)
      } catch (err) {
        return cb(err)
      }
    }
  )
)
