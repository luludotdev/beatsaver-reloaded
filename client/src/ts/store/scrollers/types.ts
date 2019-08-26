import { QueryType, SearchType } from '../../components/Beatmap/BeatmapAPI'

export enum ScrollerActionTypes {
  INIT_SCROLLER = '@@scrollers/INIT_SCROLLER',
  RESET_SCROLLER = '@@scrollers/RESET_SCROLLER',

  SET_LOADING = '@@scrollers/SET_LOADING',
  SET_ERROR = '@@scrollers/SET_ERROR',
  SET_DONE = '@@scrollers/SET_DONE',
  SET_LAST_PAGE = '@@scrollers/SET_LAST_PAGE',
  APPEND_MAPS = '@@scrollers/APPEND_MAPS',
}

export interface IScroller {
  key: string

  type: QueryType | SearchType
  query: string | undefined
  difficulty: string[]
  timeframe: number
  sortBy: number

  error: Error | undefined
  loading: boolean
  done: boolean

  lastPage: number | null
  maps: IBeatmap[]
}

export interface IScrollersState {
  [key: string]: IScroller | undefined
}
