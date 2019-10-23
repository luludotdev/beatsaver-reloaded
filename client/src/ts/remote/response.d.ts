declare interface IResponse<T extends object> {
  docs: T[]
  totalDocs: string

  lastPage: number
  prevPage: number | null
  nextPage: number | null
}

interface IRespError {
  code: number
  identifier: string
}

declare interface IFieldsError extends IRespError {
  identifier: 'ERR_INVALID_FIELDS'

  fields?: Array<{
    kind: string
    path: string
  }>
}

declare interface IValidationError extends IRespError {
  identifier: 'ERR_SCHEMA_VALIDATION_FAILED'

  filename: string
  path: string | null
  message: string
}
