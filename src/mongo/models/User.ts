import mongoose, { Document, Schema } from 'mongoose'
import withoutVersionKey from '../plugins/withoutVersionKey'

export interface IUserLean {
  username: string
}

export type IUserModel = IUserLean & Document

const schema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
})

schema.plugin(withoutVersionKey)
const User = mongoose.model<IUserModel>('user', schema)
export default User
