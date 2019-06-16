import { Reducer } from 'redux'
import { IScrollersState, ScrollerActionTypes } from './types'

const initialState: IScrollersState = {}

export const scrollersReducer: Reducer<
  IScrollersState,
  IAnyAction<ScrollerActionTypes>
> = (state = initialState, action) => {
  switch (action.type) {
    case ScrollerActionTypes.INIT_SCROLLER:
      return { ...state, [action.payload.key]: action.payload }

    case ScrollerActionTypes.RESET_SCROLLER:
      return { ...state, [action.payload]: undefined }

    case ScrollerActionTypes.SET_LOADING:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          loading: action.payload.value,
        },
      }

    case ScrollerActionTypes.SET_ERROR:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          error: action.payload.value,
        },
      }

    case ScrollerActionTypes.SET_DONE:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          done: action.payload.value,
        },
      }

    case ScrollerActionTypes.SET_LAST_PAGE:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          lastPage: action.payload.value,
        },
      }

    case ScrollerActionTypes.APPEND_MAPS:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          maps: [
            ...(state[action.payload.key] || { maps: [] }).maps,
            ...action.payload.value,
          ],
        },
      }

    default:
      return state
  }
}
