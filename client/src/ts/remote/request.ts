import pDebounce from 'p-debounce'
import { Dispatch } from 'redux'
import { SearchTypes } from '../components/Beatmap/BeatmapAPI'
import { IState } from '../store'
import { ScrollerActionTypes } from '../store/scrollers'
import { initializeScroller } from '../store/scrollers/actions'
import { axios } from '../utils/axios'

const request: (
  dispatch: Dispatch<IAnyAction<ScrollerActionTypes>>,
  getState: () => IState,
  key: string,
  type: SearchTypes,
  query: string | undefined
) => Promise<void> = async (dispatch, getState, key, type, query) => {
  initializeScroller(key, type, query)(dispatch, getState)
  const scroller = getState().scrollers[key]
  if (scroller === undefined) return undefined

  const isUser = type === 'uploader'
  const isSearch = type === 'text' || type === 'hash'
  const page = scroller.lastPage === null ? 0 : scroller.lastPage + 1

  if ((isUser || isSearch) && !query) {
    dispatch({
      payload: { key, value: true },
      type: ScrollerActionTypes.SET_DONE,
    })

    return
  }

  const url = isUser
    ? `/maps/${type}/${query}/${page}?automapper=1`
    : isSearch
    ? `/search/${type}/${page}?q=${encodeURIComponent(
        query || ''
      )}&?automapper=1`
    : `/maps/${type}/${page}?automapper=1`

  dispatch({
    payload: { key, value: true },
    type: ScrollerActionTypes.SET_LOADING,
  })

  try {
    const resp = await axios.get<IBeatmapResponse>(url)
    dispatch({
      payload: { key, value: false },
      type: ScrollerActionTypes.SET_LOADING,
    })

    if (resp.data.nextPage === null) {
      dispatch({
        payload: { key, value: true },
        type: ScrollerActionTypes.SET_DONE,
      })
    }

    dispatch({
      payload: { key, value: page },
      type: ScrollerActionTypes.SET_LAST_PAGE,
    })

    dispatch({
      payload: { key, value: resp.data.docs },
      type: ScrollerActionTypes.APPEND_MAPS,
    })
  } catch (err) {
    dispatch({
      payload: { key, value: false },
      type: ScrollerActionTypes.SET_LOADING,
    })

    dispatch({
      payload: { key, value: err },
      type: ScrollerActionTypes.SET_ERROR,
    })
  }
}

const dRequest = pDebounce(request, 300)
export { dRequest as request }
