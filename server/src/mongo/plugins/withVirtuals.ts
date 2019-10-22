import { Schema } from 'mongoose'

export const withVirtuals = (schema: Schema) => {
  const toJSON = schema.get('toJSON')
  schema.set('toJSON', { ...toJSON, virtuals: true, getters: true })
}
