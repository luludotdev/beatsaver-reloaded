import { PrefsActionTypes } from './types'

type TypedThunk<P = any> = Thunk<PrefsActionTypes, P>

export type ToggleShowAutos = ThunkFunction<typeof toggleShowAutos>
export const toggleShowAutos: () => TypedThunk<boolean> = () => (
  dispatch,
  getState
) => {
  const state = getState()

  const value = !state.prefs.showAutos
  localStorage.setItem('@@prefs/showAutos', `${value}`)

  dispatch({
    payload: value,
    type: PrefsActionTypes.SET_SHOW_AUTOS,
  })
}
