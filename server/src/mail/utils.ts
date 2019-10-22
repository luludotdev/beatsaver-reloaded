import { IUserModel } from '~mongo/models'

export const formatRecipient = (user: IUserModel) =>
  `${user.username} <${user.email}>`

export const sendTo = (user: string | IUserModel) =>
  typeof user === 'string' ? user : formatRecipient(user)
