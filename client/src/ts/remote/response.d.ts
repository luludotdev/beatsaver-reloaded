declare interface IResponse<T extends object> {
  docs: T[]
  totalDocs: string

  lastPage: number
  prevPage: number | null
  nextPage: number | null
}

declare interface IRespError {
  code: number
  identifier: string

  fields?: Array<{
    kind: string
    path: string
  }>
}
