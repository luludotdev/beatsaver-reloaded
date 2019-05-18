import { compare } from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../mongo/models/User'

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username })
      if (!user) return cb(null, false)

      const valid = await compare(password, user.password)
      if (!valid) return cb(null, false)

      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  })
)
