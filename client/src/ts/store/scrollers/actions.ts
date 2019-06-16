import { SearchTypes } from '../../components/Beatmap/BeatmapAPI'
import { request } from '../../remote/request'
import { IScroller, ScrollerActionTypes } from './types'

type TypedThunk<P = any> = Thunk<ScrollerActionTypes, P>

export type InitializeScroller = ThunkFunction<typeof initializeScroller>
export const initializeScroller: (
  key: string,
  type: SearchTypes,
  query: string | undefined
) => TypedThunk = (key, type, query) => (dispatch, getState) => {
  const defaultScroller: IScroller = {
    key,
    query,
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
  query: string | undefined
) => TypedThunk = (key, type, query) => async (dispatch, getState) => {
  request(dispatch, getState, key, type, query)
}
