import { IS_DEV } from '~environment'

export default class CodedError extends Error {
  public code: number
  public identifier: string
  public status: number

  public ext: { [key: string]: any } = {}

  constructor(
    message: string,
    code: number,
    identifier: string,
    status?: number
  ) {
    super(message)

    this.code = code
    this.identifier = identifier
    this.status = status || 500
  }

  public get statusCode() {
    return this.status
  }

  public get body() {
    const { message, code, identifier, ext } = this
    return IS_DEV
      ? { message, code, identifier, ...ext }
      : { code, identifier, ...ext }
  }
}
