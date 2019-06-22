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

declare interface IDifficultyJSON {
  _version: string
  _BPMChanges: IBPMChange[]
  _events: IEvent[]
  _notes: INote[]
  _obstacles: IObstacle[]
  _bookmarks: IBookmark[]
}

declare interface IBPMChange {
  _BPM: number
  _time: number
  _beatsPerBar: number
  _metronomeOffset: number
}

declare interface IEvent {
  _time: number
  _type: number
  _value: number
}

declare interface INote {
  _time: number
  _lineIndex: number
  _lineLayer: number
  _type: number
  _cutDirection: number
}

declare interface IObstacle {
  _time: number
  _lineIndex: number
  _type: number
  _duration: number
  _width: number
}

declare interface IBookmark {
  _time: number
  _name: string
}

declare interface IParsedBeatmap {
  metadata: {
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string

    bpm: number

    difficulties: {
      easy: IParsedDifficulty | null
      normal: IParsedDifficulty | null
      hard: IParsedDifficulty | null
      expert: IParsedDifficulty | null
      expertPlus: IParsedDifficulty | null
    }

    characteristics: string[]
  }

  hash: string
  coverExt: string
}

declare interface IParsedDifficulty {
  notes: number
  obstacles: number
  duration: number
}
