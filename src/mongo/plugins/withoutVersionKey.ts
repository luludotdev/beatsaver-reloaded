import { ObjectId } from 'bson'
import { Schema } from 'mongoose'

interface IBaseDocument {
  _id: ObjectId
  __v: number
}

const withoutVersionKey = (schema: Schema) => {
  const transform = (_: any, document: IBaseDocument) => {
    delete document.__v
  }

  schema.set('toJSON', { transform })
  schema.set('toObject', { transform })
}

export default withoutVersionKey
