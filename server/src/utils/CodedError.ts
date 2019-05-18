import { IS_DEV } from '../env'

export default class CodedError extends Error {
  public code: number
  public identifier: string
  public status: number

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
    const { message, code, identifier } = this
    return IS_DEV ? { message, code, identifier } : { code, identifier }
  }
}
