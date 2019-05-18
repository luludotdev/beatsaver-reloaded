export interface IResponse<T extends object> {
  docs: T[]
  totalDocs: string

  lastPage: number
  prevPage: number | null
  nextPage: number | null
}
