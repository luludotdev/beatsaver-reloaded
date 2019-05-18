export enum UserActionTypes {
  LOG_IN = '@@user/LOG_IN',
  LOG_OUT = '@@popup/LOG_OUT',
}

export interface IUser {
  _id: string
  username: string
  admin: boolean
}

export interface IUserState {
  login: IUser | null
}
