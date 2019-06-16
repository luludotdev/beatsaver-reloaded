declare module 'mongoosastic' {
  import { Schema } from 'mongoose'

  declare interface IMongoosasticOptions {
    index: string
    type: string

    hosts: string[]
    host: string
    port: number
    protocol: 'http' | 'https'

    populate: Array<{ path: string; select?: string }>
    hydrate: boolean
    indexAutomatically: boolean
    saveOnSynchronize: boolean
  }

  function mongoosastic(
    schema: Schema,
    options: Partial<IMongoosasticOptions>
  ): any

  export default mongoosastic
}

declare module 'mongoose' {
  import { Readable } from 'stream'

  // tslint:disable-next-line: interface-name
  declare interface SchemaTypeOpts<T> {
    es_indexed?: boolean
    es_type?: 'object' | 'nested'
    es_include_in_parent?: boolean
    es_boost?: number
    es_null_value?: any
    es_type?: 'integer' | 'date' | 'string'
    es_schema?: Schema
  }

  declare interface ISearchResponse<T> {
    took: number
    timed_out: boolean
    _shards: {
      total: number
      successful: number
      skipped: number
      failed: number
    }

    hits: {
      max_score: number | null
      total: {
        value: number
        relation: string
      }

      hits: Array<{
        _index: string
        _type: string
        _id: string
        _score: number
        _source: T
      }>
    }
  }

  declare interface IFullSearch {
    query: any
    from: number
    size: number
  }

  // tslint:disable-next-line: interface-name
  declare interface Model<T extends Document, QueryHelpers = {}> {
    public synchronize(query?: any): Readable
    public esTruncate(callback: (err: Error | undefined) => any): void

    public search<S = any>(
      query: any,
      callback: (err: Error | undefined, results: ISearchResponse<S>) => any
    ): void

    public esSearch<S = any>(
      query: IFullSearch,
      callback: (err: Error | undefined, results: ISearchResponse<S>) => any
    ): void
  }
}
