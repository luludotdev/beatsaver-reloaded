import { ObjectId } from 'bson'
import { Schema } from 'mongoose'

interface IBaseDocument {
  _id: ObjectId
  __v: number

  [index: string]: any
}

const withoutKeys = (...keys: Readonly<string[]>) => (schema: Schema) => {
  const toJSON = schema.get('toJSON')
  const toObject = schema.get('toObject')

  const transform = (_: any, document: IBaseDocument) => {
    for (const key of keys) {
      delete document[key]
    }
  }

  schema.set('toJSON', { ...toJSON, transform })
  schema.set('toObject', { ...toObject, transform })
}

export default withoutKeys
