import fs, { PathLike, Stats } from 'fs'
import globby from 'globby'
import mkdirp from 'mkdirp'
import { join } from 'path'
import rimraf from 'rimraf'
import { promisify } from 'util'

const mkdirpPromise = promisify(mkdirp)
export { mkdirpPromise as mkdirp }

const rimrafPromise = promisify(rimraf)
export { rimrafPromise as rimraf }

export const access = promisify(fs.access)
export const readFile = promisify(fs.readFile)
export const write = promisify(fs.write)
export const writeFile = promisify(fs.writeFile)
export const stat = promisify(fs.stat)
export const rename = promisify(fs.rename)

export const exists = async (path: PathLike) => {
  try {
    await access(path, fs.constants.F_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
    else throw err
  }
}

interface IGlobStats extends Stats {
  path: string
  absolute: string
  depth: number
}

export const globStats: (
  patterns: string | readonly string[],
  options?: globby.GlobbyOptions
) => Promise<readonly IGlobStats[]> = async (patterns, options) => {
  const opts: globby.GlobbyOptions = { ...options, stats: true }

  const globs: unknown[] = await globby(patterns, opts)
  globs.forEach((x: any) => {
    x.absolute = opts.cwd !== undefined ? join(opts.cwd, x.path) : x.path
    return x
  })

  return globs as IGlobStats[]
}
