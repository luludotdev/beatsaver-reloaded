import { ImagesActionTypes } from './types'

type TypedThunk<P = any> = Thunk<ImagesActionTypes, P>

export type LoadImage = ThunkFunction<typeof loadImage>
export const loadImage: (
  url: string
) => TypedThunk<boolean> = url => async dispatch => {
  const setImage = (payload: boolean) => {
    dispatch({
      payload,
      type: ImagesActionTypes.SET_IMAGE,
    })
  }

  fetch(url)
    .then(resp => {
      if (resp.ok) setImage(true)
      else setImage(false)
    })
    .catch(() => setImage(false))
}
