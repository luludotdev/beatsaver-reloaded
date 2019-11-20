import mongoosastic from 'mongoosastic'
import mongoose, { Document, PaginateModel, Schema, Types } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { BEATSAVER_EPOCH } from '~constants'
import { ELASTIC_HOST, ELASTIC_PORT, IS_DEV, PORT } from '~environment'
import { withoutKeys, withVirtuals } from '~mongo/plugins'
import { IUserModel, userSchema } from './User'

export interface IVoteLean {
  direction: -1 | 1
  voterUID: string
}

export interface IBeatmapLean {
  key: string
  name: string
  description: string

  uploader: IUserModel['_id']
  uploaded: Date
  deletedAt: Date | null

  metadata: {
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string

    duration: number
    bpm: number

    difficulties: {
      easy: boolean
      normal: boolean
      hard: boolean
      expert: boolean
      expertPlus: boolean
    }

    characteristics: IBeatmapCharacteristic[]
  }

  stats: {
    downloads: number
    plays: number

    upVotes: number
    downVotes: number

    rating: number
    heat: number
  }

  votes: Types.DocumentArray<IVoteLean & Document>

  directDownload: string
  downloadURL: string
  coverURL: string
  coverExt: string

  hash: string
}

export type IBeatmapModel = IBeatmapLean & Document

const schema: Schema = new Schema({
  key: {
    get: (v: number | undefined) => (v ? v.toString(16) : 0),
    required: true,
    set: (v: string) => parseInt(v, 16),
    type: Number,
    unique: true,
  },

  description: { type: String, default: '', maxlength: 10000 },
  name: {
    es_indexed: true,
    index: true,
    maxlength: 255,
    required: true,
    type: String,
  },

  deletedAt: { type: Date, default: null, index: true, es_indexed: true },
  uploaded: { type: Date, default: Date.now, index: true, es_indexed: true },
  uploader: {
    es_indexed: true,
    es_schema: userSchema,
    ref: 'user',
    required: true,
    type: Schema.Types.ObjectId,
  },

  metadata: {
    duration: { type: Number, default: 0, min: 0 },
    levelAuthorName: {
      es_indexed: true,
      maxlength: 255,
      required: true,
      type: String,
    },
    songAuthorName: {
      es_indexed: true,
      maxlength: 255,
      required: true,
      type: String,
    },
    songName: {
      es_indexed: true,
      maxlength: 255,
      required: true,
      type: String,
    },
    songSubName: { type: String, maxlength: 255, es_indexed: false },

    bpm: { type: Number, required: true },

    difficulties: {
      easy: { type: Boolean, required: true },
      expert: { type: Boolean, required: true },
      expertPlus: { type: Boolean, required: true },
      hard: { type: Boolean, required: true },
      normal: { type: Boolean, required: true },
    },

    characteristics: { es_indexed: false, type: [Schema.Types.Mixed] },
  },

  stats: {
    downloads: { type: Number, default: 0, index: true, es_indexed: false },
    plays: { type: Number, default: 0, index: true, es_indexed: false },

    downVotes: { type: Number, default: 0, es_indexed: false },
    upVotes: { type: Number, default: 0, es_indexed: false },

    heat: { type: Number, default: 0, index: true, es_indexed: false },
    rating: { type: Number, default: 0, index: true, es_indexed: false },

    es_indexed: false,
  },

  votes: {
    es_indexed: false,
    type: [
      {
        direction: {
          default: 1,
          max: 1,
          min: -1,
          required: true,
          type: Number,
        },
        voterUID: { type: String, required: true, index: true },
      },
    ],
  },

  coverExt: { type: String, required: true, maxlength: 5 },
  hash: {
    es_indexed: true,
    maxlength: 40,
    required: true,
    type: String,
    unique: true,
  },
})

schema.pre('save', async function preSave(this: IBeatmapModel) {
  const total = this.votes.length
  const upVotes = this.votes.filter(x => x.direction === 1).length
  const downVotes = this.votes.filter(x => x.direction === -1).length

  const calculateRating = () => {
    if (total === 0) return 0

    const score = upVotes / total
    return score - (score - 0.5) * Math.pow(2, -Math.log10(total + 1))
  }

  const calculateHeat = () => {
    const epoch = new Date(Date.UTC(1970, 0, 1))
    const seconds =
      (this.uploaded.getTime() - epoch.getTime()) / 1000 - BEATSAVER_EPOCH

    const score = this.votes.reduce((acc, curr) => acc + curr.direction, 0)
    const absolute = Math.abs(score)
    const sign = score < 0 ? -1 : score > 0 ? 1 : 0

    const order = Math.log10(Math.max(absolute, 1))
    const heat = sign * order + seconds / 45000

    return parseFloat(heat.toFixed(7))
  }

  this.stats.upVotes = upVotes
  this.stats.downVotes = downVotes
  this.stats.rating = calculateRating()
  this.stats.heat = calculateHeat()
})

schema.virtual('directDownload').get(function(this: IBeatmapModel) {
  const absolute = `/cdn/${this.key}/${this.hash}.zip`
  return IS_DEV ? `http://localhost:${PORT}${absolute}` : absolute
})

schema.virtual('downloadURL').get(function(this: IBeatmapModel) {
  const absolute = `/download/key/${this.key}`
  return IS_DEV ? `http://localhost:${PORT}${absolute}` : `/api${absolute}`
})

schema.virtual('coverURL').get(function(this: IBeatmapModel) {
  const absolute = `/cdn/${this.key}/${this.hash}${this.coverExt}`
  return IS_DEV ? `http://localhost:${PORT}${absolute}` : absolute
})

schema.plugin(paginate)
schema.plugin(mongoosastic, {
  host: ELASTIC_HOST,
  populate: [
    {
      path: 'uploader',
    },
  ],
  port: ELASTIC_PORT,
})
schema.plugin(withoutKeys(['__v', 'votes', 'id', 'coverExt', 'converted']))
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

export const Beatmap = mongoose.model<IBeatmapModel>(
  'beatmap',
  schema
) as PaginateModel<IBeatmapModel>
