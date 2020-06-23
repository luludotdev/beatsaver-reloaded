import { Reducer } from 'redux'
import { IPrefsState, PrefsActionTypes } from './types'

const initialState: IPrefsState = {
  showAutos: localStorage.getItem('@@prefs/showAutos') === 'true' ?? false,
}

export const prefsReducer: Reducer<
  IPrefsState,
  IAnyAction<PrefsActionTypes>
> = (state = initialState, action) => {
  switch (action.type) {
    case PrefsActionTypes.SET_SHOW_AUTOS:
      return { ...state, showAutos: action.payload }

    default:
      return state
  }
}
