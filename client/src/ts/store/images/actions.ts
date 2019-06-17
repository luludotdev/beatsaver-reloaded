import { ImagesActionTypes } from './types'

type TypedThunk<P = any> = Thunk<ImagesActionTypes, P>

export type LoadImage = ThunkFunction<typeof loadImage>
export const loadImage: (
  url: string
) => TypedThunk<{ key: string; value: boolean }> = url => async dispatch => {
  const setImage = (value: boolean) => {
    dispatch({
      payload: { key: url, value },
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
