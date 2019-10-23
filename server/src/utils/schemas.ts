import Ajv, { ValidateFunction } from 'ajv'
import axios from './axios'
import signale from './signale'

let loaded = false
const ajv = new Ajv()
const cache: Map<string, any> = new Map()

const loadSchema: (url: string) => Promise<void> = async url => {
  const resp = await axios.get(url)
  if (typeof resp.data !== 'object') {
    throw new Error('Schema response is not an object')
  }

  cache.set(url, resp.data)
}

const initialSync: () => Promise<void> = async () => {
  if (loaded === true) return
  loaded = true

  await sync()
}

export const sync: () => Promise<void> = async () => {
  signale.start('Syncing schemas...')

  const keys = [...cache.keys()]
  await Promise.all(keys.map(x => loadSchema(x)))

  signale.complete('Schema sync complete!')
}

export const compile: (
  url: string
) => Promise<ValidateFunction> = async url => {
  await initialSync()
  if (cache.has(url) === false) {
    throw new Error('Schema URL is not registered in this store')
  }

  const schema = cache.get(url)
  ajv.removeSchema(url)

  return ajv.compile(schema)
}

export const register: (url: string) => Promise<void> = async url => {
  await loadSchema(url)
}

export const deregister: (url: string) => void = url => {
  cache.delete(url)
}
