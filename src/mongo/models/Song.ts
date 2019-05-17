import mongoose, { Document, Schema } from 'mongoose'
import withoutKeys from '../plugins/withoutKeys'
import withVirtuals from '../plugins/withVirtuals'
import { IUserModel } from './User'

export interface ISongLean {
  key: string
  name: string
  description: string

  uploader: IUserModel['_id']
  uploaded: Date

  metadata: {
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string

    bpm: number
  }

  stats: {
    downloads: number
    plays: number

    upVotes: number
    downVotes: number
    rating: number
  }

  votes: Array<{
    user: IUserModel['_id']
    direction: -1 | 1
  }>

  permalink: string
  downloadURL: string
  coverURL: string

  hashes: {
    sha1: string
    md5: string
  }
}

export type ISongModel = ISongLean & Document

const schema: Schema = new Schema({
  key: {
    get: (v: number) => v.toString(16),
    required: true,
    set: (v: string) => parseInt(v, 16),
    type: Number,
    unique: true,
  },

  description: { type: String, default: '', maxlength: 10000 },
  name: { type: String, required: true, index: true, maxlength: 255 },

  uploaded: { type: Date, default: Date.now },
  uploader: { type: Schema.Types.ObjectId, required: true },

  metadata: {
    levelAuthorName: {
      index: true,
      maxlength: 255,
      required: true,
      type: String,
    },
    songAuthorName: {
      index: true,
      maxlength: 255,
      required: true,
      type: String,
    },
    songName: { type: String, required: true, index: true, maxlength: 255 },
    songSubName: { type: String, required: true, index: true, maxlength: 255 },

    bpm: { type: Number, required: true },
  },

  stats: {
    downloads: { type: Number, default: 0 },
    plays: { type: Number, default: 0 },
  },

  votes: [
    {
      direction: { type: Number, required: true, default: 1, min: -1, max: 1 },
      user: { type: Schema.Types.ObjectId, required: true, index: true },
    },
  ],

  hashes: {
    md5: { type: String, required: true, index: true, maxlength: 32 },
    sha1: { type: String, required: true, index: true, maxlength: 40 },
  },
})

schema.virtual('stats.upVotes').get(function(this: ISongModel) {
  return this.votes.filter(x => x.direction === 1).length
})

schema.virtual('stats.downVotes').get(function(this: ISongModel) {
  return this.votes.filter(x => x.direction === -1).length
})

schema.virtual('stats.rating').get(function(this: ISongModel) {
  const upVotes = this.votes.filter(x => x.direction === 1).length
  const downVotes = this.votes.filter(x => x.direction === -1).length

  const total = upVotes + downVotes
  const score = upVotes / total

  return score - (score - 0.5) * Math.pow(2, -Math.log10(total + 1))
})

schema.plugin(withoutKeys('__v', 'votes'))
schema.plugin(withVirtuals)

const Song = mongoose.model<ISongModel>('song', schema)
export default Song
