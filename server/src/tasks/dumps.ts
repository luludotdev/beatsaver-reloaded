import { createHash } from 'crypto'
import { createWriteStream, PathLike } from 'fs'
import { Document, DocumentQuery } from 'mongoose'
import { schedule } from 'node-cron'
import { join } from 'path'
import { createGzip } from 'zlib'
import { DUMP_PATH } from '../constants'
import Beatmap from '../mongo/models/Beatmap'
import User from '../mongo/models/User'
import { exists, mkdirp, rename, stat } from '../utils/fs'
import signale from '../utils/signale'
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

type DumpFunction<R = void> = <D, DocType extends Document, QueryHelpers = {}>(
  path: string,
  query: DocumentQuery<D, DocType, QueryHelpers>
) => Promise<R>

const writeDump: DumpFunction = async (name, query) => {
  await mkdirp(DUMP_PATH)

  const filePath = join(DUMP_PATH, `${name}.temp.json`)
  const gzPath = join(DUMP_PATH, `${name}.temp.json.gz`)

  const hash = createHash('sha1')
  const fileStream = createWriteStream(filePath)
  const gzStream = createWriteStream(gzPath)

  const source = query.cursor().pipe(jsonStream())
  source.on('data', chunk => hash.update(chunk))

  const file = source.pipe(fileStream)
  const zip = source.pipe(createGzip()).pipe(gzStream)

  const [sha1] = await Promise.all([
    new Promise(resolve =>
      source.on('end', () => resolve(hash.digest('hex')))
    ) as Promise<string>,
    new Promise(resolve => file.on('close', () => resolve())),
    new Promise(resolve => zip.on('close', () => resolve())),
  ])

  const shortHash = sha1.substr(0, 6)
  await rename(filePath, join(DUMP_PATH, `${name}.${shortHash}.json`))
  await rename(gzPath, join(DUMP_PATH, `${name}.${shortHash}.json.gz`))
}

const checkAndDump: DumpFunction<boolean> = async (path, query) => {
  const stale = await isStale(path)
  if (!stale) return false

  await writeDump(path, query)
  return true
}

const dumpTask = async () =>
  Promise.all([
    checkAndDump(
      'maps',
      Beatmap.find({}, '-votes')
        .sort({ uploaded: -1 })
        .populate('uploader')
    ),
    checkAndDump(
      'users',
      User.find({}, '-password -email -verified -verifyToken -admin')
    ),
  ])

signale.pending('Starting JSON dump task...')
schedule('*/10 * * * *', async () => {
  signale.start('Creating JSON dumps!')
  const [maps, users] = await dumpTask()

  if (maps || users) signale.complete('Dumping complete!')
  else signale.complete('Dumps were not modified.')
})
