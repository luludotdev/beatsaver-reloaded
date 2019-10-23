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
