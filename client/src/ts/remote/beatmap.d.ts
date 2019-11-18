declare interface IBeatmap {
  _id: string
  key: string
  name: string
  description: string

  uploader: {
    _id: string
    username: string
  }

  uploaded: Date | string

  metadata: {
    songName: string
    songSubName: string
    songAuthorName: string
    songDuration: number
    levelAuthorName: string

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

  stats: IStats

  downloadURL: string
  directDownload: string
  coverURL: string

  hash: string
}

declare interface IStats {
  downloads: number
  plays: number

  upVotes: number
  downVotes: number

  rating: number
  heat: number
}

declare interface IBeatmapCharacteristic {
  name: string
  difficulties: {
    easy: IDifficulty | null
    normal: IDifficulty | null
    hard: IDifficulty | null
    expert: IDifficulty | null
    expertPlus: IDifficulty | null
  }
}

declare interface IDifficulty {
  duration: number
  length: number
  bombs: number
  notes: number
  obstacles: number
  njs: number
}

declare interface IMapStats {
  _id: IBeatmap['_id']
  key: IBeatmap['key']
  hash: IBeatmap['hash']

  stats: IStats
}

declare type IBeatmapResponse = IResponse<IBeatmap>
