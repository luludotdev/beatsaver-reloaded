import { ObjectId } from 'bson'
import { Schema } from 'mongoose'

interface IBaseDocument {
  _id: ObjectId
  __v: number

  [index: string]: any
}

export const withoutKeys = (
  keys: Readonly<string[]>,
  skipObject: boolean = false
) => (schema: Schema) => {
  const toJSON = schema.get('toJSON')
  const toObject = schema.get('toObject')

  const transform = (_: any, document: IBaseDocument) => {
    keys.forEach(k => (document[k] = undefined))
  }

  schema.set('toJSON', { ...toJSON, transform })
  if (!skipObject) schema.set('toObject', { ...toObject, transform })
}
