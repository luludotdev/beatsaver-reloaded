import mongoose, { Document, Schema } from 'mongoose'
import withoutKeys from '../plugins/withoutKeys'

export interface IUserLean {
  username: string
  email: string
  password: string

  verified: boolean
  verifyToken: string

  links: {
    steam?: string
    oculus?: string
  }

  admin: boolean
}

export type IUserModel = IUserLean & Document

const schema: Schema = new Schema({
  email: {
    index: true,
    lowercase: true,
    match: /\S+@\S+\.\S+/,
    required: true,
    type: String,
    unique: true,
  },
  password: { type: String, required: true, maxlength: 72 },
  username: {
    lowercase: true,
    maxlength: 24,
    required: true,
    type: String,
    unique: true,
  },

  verified: { type: Boolean, default: false },
  verifyToken: { type: String, default: null },

  links: {
    oculus: { type: String, default: undefined, maxlength: 16 },
    steam: { type: String, default: undefined, maxlength: 17 },
  },

  admin: { type: Boolean, default: false },
})

schema.plugin(
  withoutKeys(
    ['__v', 'email', 'password', 'verified', 'verifyToken', 'admin'],
    true
  )
)

const User = mongoose.model<IUserModel>('user', schema)
export default User
