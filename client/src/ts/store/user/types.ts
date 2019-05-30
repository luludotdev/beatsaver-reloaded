export enum UserActionTypes {
  SET_USER = '@@user/SET_USER',
}

export interface IUser {
  _id: string
  username: string

  verified: boolean
  admin: boolean

  links: {
    steam?: string
    oculus?: string
  }
}

export interface IUserState {
  login: IUser | null | undefined
}
