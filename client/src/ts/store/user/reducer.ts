import { Reducer } from 'redux'
import { IAnyAction } from '..'
import { IUserState, UserActionTypes } from './types'

const initialState: IUserState = { login: null }

export const userReducer: Reducer<IUserState, IAnyAction<UserActionTypes>> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UserActionTypes.SET_USER:
      return { ...state, login: action.payload }

    default:
      return state
  }
}
