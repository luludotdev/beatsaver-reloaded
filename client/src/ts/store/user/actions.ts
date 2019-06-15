import { Thunk } from '..'
import { axios } from '../../utils/axios'
import { IUser, UserActionTypes } from './types'

type TypedThunk<P = any> = Thunk<UserActionTypes, P>

export const checkUser: () => TypedThunk<IUser | null> = () => async dispatch => {
  try {
    const user = await axios.get<IUser>('/users/me')

    dispatch({
      payload: user.data,
      type: UserActionTypes.SET_USER,
    })
  } catch (err) {
    dispatch({
      payload: null,
      type: UserActionTypes.SET_USER,
    })
  }
}

export const login: (
  username: string,
  password: string
) => TypedThunk<IUser | null> = (username, password) => async (
  dispatch,
  getState
) => {
  await axios.post('/auth/login', { username, password })
  await checkUser()(dispatch, getState)
}

export const logout: () => TypedThunk<null> = () => dispatch => {
  localStorage.removeItem('token')

  dispatch({
    payload: null,
    type: UserActionTypes.SET_USER,
  })
}
