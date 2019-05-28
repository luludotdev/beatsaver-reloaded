export interface IBeatmapInfo {
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

export interface IBeatmapSet {
  _beatmapCharacteristicName: string
  _difficultyBeatmaps: IDifficultyBeatmap[]
}

export interface IDifficultyBeatmap {
  _difficulty: string
  _difficultyRank: number
  _beatmapFilename: string
}
