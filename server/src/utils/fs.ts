import fs from 'fs'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { promisify } from 'util'

const mkdirpPromise = promisify(mkdirp)
export { mkdirpPromise as mkdirp }

const rimrafPromise = promisify(rimraf)
export { rimrafPromise as rimraf }

export const writeFile = promisify(fs.writeFile)
