import { createWriteStream, PathLike } from 'fs'
import { Document, DocumentQuery } from 'mongoose'
import { join } from 'path'
import { DUMP_PATH } from '../constants'
import Beatmap from '../mongo/models/Beatmap'
import User from '../mongo/models/User'
import { exists, mkdirp, stat } from '../utils/fs'
import { jsonStream } from '../utils/streams'

const mapDump = join(DUMP_PATH, 'maps.json')
const userDump = join(DUMP_PATH, 'users.json')

const isStale = async (path: PathLike) => {
  const fileExists = await exists(path)
  if (!fileExists) return true

  const stats = await stat(path)
  const now = new Date()

  if (stats.mtime.getUTCDay() !== now.getUTCDay()) return true
  if (stats.mtime.getUTCMonth() !== now.getUTCMonth()) return true
  if (stats.mtime.getUTCFullYear() !== now.getUTCFullYear()) return true

  return false
}

type DumpFunction<R> = <T, DocType extends Document, QueryHelpers = {}>(
  path: PathLike,
  query: DocumentQuery<T, DocType, QueryHelpers>
) => Promise<R>

const writeDump: DumpFunction<void> = (path, query) =>
  new Promise(resolve => {
    query
      .cursor()
      .pipe(jsonStream())
      .pipe(createWriteStream(path))
      .on('close', () => resolve())
  })

const checkAndDump: DumpFunction<void> = async (path, query) => {
  const stale = await isStale(path)
  if (stale) return writeDump(path, query)
}

const dumpTask = async () => {
  await mkdirp(DUMP_PATH)

  return Promise.all([
    checkAndDump(
      mapDump,
      Beatmap.find({}, '-votes')
        .sort({ uploaded: -1 })
        .populate('uploader')
    ),
    checkAndDump(
      userDump,
      User.find({}, '-password -email -verified -verifyToken -admin')
    ),
  ])
}
