import fs, { PathLike } from 'fs'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { promisify } from 'util'

const mkdirpPromise = promisify(mkdirp)
export { mkdirpPromise as mkdirp }

const rimrafPromise = promisify(rimraf)
export { rimrafPromise as rimraf }

export const access = promisify(fs.access)
export const writeFile = promisify(fs.writeFile)
export const stat = promisify(fs.stat)

export const exists = async (path: PathLike) => {
  try {
    await access(path, fs.constants.F_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
    else throw err
  }
}
