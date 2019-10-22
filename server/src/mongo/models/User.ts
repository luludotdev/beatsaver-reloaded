import mongoose, { Document, Schema } from 'mongoose'
import { withoutKeys } from '~mongo/plugins'

export interface IRedactedUser {
  username: string
  verified: boolean

  admin: boolean

  links: {
    steam?: string
    oculus?: string
  }
}

export interface IUserLean extends IRedactedUser {
  email: string
  password: string

  verifyToken: string | null
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
    es_indexed: true,
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

export const User = mongoose.model<IUserModel>('user', schema)
export { schema as userSchema }
