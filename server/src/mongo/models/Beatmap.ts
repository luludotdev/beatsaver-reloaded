import mongoose, { Document, PaginateModel, Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import withoutKeys from '../plugins/withoutKeys'
import withVirtuals from '../plugins/withVirtuals'
import { IUserModel } from './User'

export interface IBeatmapLean {
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

  hash: string
}

export type IBeatmapModel = IBeatmapLean & Document

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
  uploader: { type: Schema.Types.ObjectId, required: true, ref: 'user' },

  metadata: {
    levelAuthorName: {
      maxlength: 255,
      required: true,
      type: String,
    },
    songAuthorName: {
      maxlength: 255,
      required: true,
      type: String,
    },
    songName: { type: String, required: true, maxlength: 255 },
    songSubName: { type: String, maxlength: 255 },

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

  hash: { type: String, required: true, index: true, maxlength: 40 },
})

schema.virtual('stats.upVotes').get(function(this: IBeatmapModel) {
  return this.votes.filter(x => x.direction === 1).length
})

schema.virtual('stats.downVotes').get(function(this: IBeatmapModel) {
  return this.votes.filter(x => x.direction === -1).length
})

schema.virtual('stats.rating').get(function(this: IBeatmapModel) {
  const upVotes = this.votes.filter(x => x.direction === 1).length
  const downVotes = this.votes.filter(x => x.direction === -1).length

  const total = upVotes + downVotes
  if (total === 0) return 0

  const score = upVotes / total
  return score - (score - 0.5) * Math.pow(2, -Math.log10(total + 1))
})

schema.plugin(paginate)
schema.plugin(withoutKeys(['__v', 'votes', 'id']))
schema.plugin(withVirtuals)

schema.index(
  {
    'metadata.levelAuthorName': 'text',
    'metadata.songAuthorName': 'text',
    'metadata.songName': 'text',
    'metadata.songSubName': 'text',
    name: 'text',
  },
  {
    name: 'full_search',
    weights: {
      'metadata.levelAuthorName': 1,
      'metadata.songAuthorName': 1,
      'metadata.songName': 2,
      'metadata.songSubName': 2,
      name: 5,
    },
  }
)

const Beatmap = mongoose.model<IBeatmapModel>(
  'beatmap',
  schema
) as PaginateModel<IBeatmapModel>
export default Beatmap
