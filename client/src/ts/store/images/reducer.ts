import { Reducer } from 'redux'
import { IImagesState, ImagesActionTypes } from './types'

const initialState: IImagesState = {}

export const imagesReducer: Reducer<
  IImagesState,
  IAnyAction<ImagesActionTypes>
> = (state = initialState, action) => {
  switch (action.type) {
    case ImagesActionTypes.RESET_IMAGE:
      return { ...state, [action.payload]: undefined }

    case ImagesActionTypes.SET_IMAGE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      }

    default:
      return state
  }
}
