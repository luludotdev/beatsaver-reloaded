declare module 'mongoose-aggregate-paginate-v2' {
  declare function _(schema: mongoose.Schema): void;
  export = _
}

declare module 'mongoose' {
  interface AggregatePaginateOptions {
    sort?: Object | string
    customLabels?: CustomLabels
    page?: number
    limit?: number
    allowDiskUse?: boolean
  }

  interface AggregatePaginateModel<T extends Document> extends PaginateModel<T> {
    aggregatePaginate(aggregateFn: Aggregate, options?: AggregatePaginateOptions, callback?: (err: any, result: PaginateResult<T>) => void): Promise<PaginateResult<T>>
  }
}
