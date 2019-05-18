import mongoose, { Document, Schema } from 'mongoose'
import withoutKeys from '../plugins/withoutKeys'

export interface IUserLean {
  username: string
  email: string
  password: string

  links: {
    steam?: string
    oculus?: string
  }

  admin: boolean
}

export type IUserModel = IUserLean & Document

const schema: Schema = new Schema({
  password: { type: String, required: true, maxlength: 255 },
  username: { type: String, required: true, unique: true, maxlength: 24 },

  links: {
    oculus: { type: String, default: undefined, maxlength: 16 },
    steam: { type: String, default: undefined, maxlength: 17 },
  },

  admin: { type: Boolean, default: false },
})

schema.plugin(withoutKeys(['__v', 'email', 'password', 'admin'], true))
const User = mongoose.model<IUserModel>('user', schema)
export default User
