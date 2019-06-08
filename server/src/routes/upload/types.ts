declare interface IBeatmapInfo {
  _version: string
  _songName: string
  _songSubName: string
  _songAuthorName: string
  _levelAuthorName: string
  _beatsPerMinute: number
  _songFilename: string
  _coverImageFilename: string
  _difficultyBeatmapSets: IBeatmapSet[]
}

declare interface IBeatmapSet {
  _beatmapCharacteristicName: string
  _difficultyBeatmaps: IDifficultyBeatmap[]
}

declare interface IDifficultyBeatmap {
  _difficulty: string
  _difficultyRank: number
  _beatmapFilename: string
}

declare interface IParsedBeatmap {
  metadata: {
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string

    bpm: number

    difficulties: {
      easy: boolean
      normal: boolean
      hard: boolean
      expert: boolean
      expertPlus: boolean
    }

    characteristics: string[]
  }

  hash: string
  coverExt: string
}
