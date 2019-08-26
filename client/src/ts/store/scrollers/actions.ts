import { SearchTypes } from '../../components/Beatmap/BeatmapAPI'
import { request } from '../../remote/request'
import { IScroller, ScrollerActionTypes } from './types'

type TypedThunk<P = any> = Thunk<ScrollerActionTypes, P>

export type InitializeScroller = ThunkFunction<typeof initializeScroller>
export const initializeScroller: (
  key: string,
  type: SearchTypes,
  query: string | undefined,
  difficulty: string[],
  timeframe: number,
  sortBy: number,
) => TypedThunk = (key, type, query, difficulty, timeframe, sortBy) => (dispatch, getState) => {
  const defaultScroller: IScroller = {
    key,
    query,
    difficulty,
    timeframe,
    sortBy,
    type,

    done: false,
    error: undefined,
    lastPage: null,
    loading: false,
    maps: [],
  }

  if (getState().scrollers[key] === undefined) {
    dispatch({
      payload: defaultScroller,
      type: ScrollerActionTypes.INIT_SCROLLER,
    })
  }
}

export type RequestNextMaps = ThunkFunction<typeof requestNextMaps>
export const requestNextMaps: (
  key: string,
  type: SearchTypes,
  query: string | undefined,
  difficulty: string[],
  timeframe: number,
  sortBy: number,
) => TypedThunk = (key, type, query, difficulty, timeframe, sortBy) => async (dispatch, getState) => {
  request(dispatch, getState, key, type, query, difficulty, timeframe, sortBy)
}
