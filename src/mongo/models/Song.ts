import mongoose, { Document, Schema } from 'mongoose'
import withoutVersionKey from '../plugins/withoutVersionKey'

export interface ISongLean {
  name: string
  version: string
}

export type ISongModel = ISongLean & Document

const schema: Schema = new Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
})

schema.plugin(withoutVersionKey)
const Song = mongoose.model<ISongModel>('song', schema)
export default Song
