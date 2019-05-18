import { Thunk } from '..'
import { axios } from '../../utils/axios'
import { IUser, UserActionTypes } from './types'

type TypedThunk<P = any> = Thunk<UserActionTypes, P>

export const login: (
  username: string,
  password: string
) => TypedThunk<IUser> = (username, password) => async dispatch => {
  await axios.post('/auth/login', { username, password })
}
