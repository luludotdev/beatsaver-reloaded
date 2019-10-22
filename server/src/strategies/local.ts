import { compare } from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from '~mongo/models'
import CodedError from '~utils/CodedError'

const ERR_INVALID_USERNAME = new CodedError(
  'invalid username',
  0x40001,
  'ERR_INVALID_USERNAME',
  404
)

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username })
      if (!user) return cb(ERR_INVALID_USERNAME, false)

      const valid = await compare(password, user.password)
      if (!valid) return cb(null, false)

      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  })
)
