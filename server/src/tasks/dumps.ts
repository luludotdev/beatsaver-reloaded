import { createHash } from 'crypto'
import { createWriteStream } from 'fs'
import { Document, DocumentQuery } from 'mongoose'
import { schedule } from 'node-cron'
import { join } from 'path'
import { createGzip } from 'zlib'
import { DUMP_PATH } from '~constants'
import { DISABLE_DUMPS } from '~environment'
import { Beatmap, User } from '~mongo/models'
import { exists, globStats, mkdirp, rename, rimraf } from '~utils/fs'
import { waitForMS } from '~utils/misc'
import signale from '~utils/signale'
import { jsonStream } from '~utils/streams'

const writeDump: <D, DocType extends Document, QueryHelpers = {}>(
  path: string,
  query: DocumentQuery<D, DocType, QueryHelpers>
) => Promise<void> = async (name, query) => {
  await mkdirp(DUMP_PATH)

  const filePath = join(DUMP_PATH, `${name}.temp.json`)
  const gzPath = join(DUMP_PATH, `${name}.temp.json.gz`)

  if (await exists(filePath)) return
  if (await exists(gzPath)) return

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

  const shortHash = (sha1 as string).substr(0, 6)
  await rename(filePath, join(DUMP_PATH, `${name}.${shortHash}.json`))
  await rename(gzPath, join(DUMP_PATH, `${name}.${shortHash}.json.gz`))

  const oneDay = 1000 * 60 * 60 * 24
  const now = Date.now()
  const cleanup = await globStats([`${name}.*`, `!${name}.temp.*`], {
    cwd: DUMP_PATH,
  })

  await Promise.all(
    cleanup
      .filter(x => now - x.mtimeMs > oneDay * 5)
      .map(x => x.absolute)
      .map(path => rimraf(path))
  )
}

const calculateDelay = () => {
  const hostname: string = process.env.HOSTNAME || 'ff'
  const shortHost = hostname.substr(0, 2)
  const hostDec = parseInt(shortHost, 16) || 255

  const random = Math.floor(Math.random() * 10000)
  return hostDec * 20 + random
}

const dumpTask = async () => {
  const delay = Math.max(0, calculateDelay())
  await waitForMS(delay)

  signale.start('Creating JSON dumps!')
  await Promise.all([
    writeDump(
      'maps',
      Beatmap.find({}, '-votes')
        .sort({ uploaded: -1 })
        .populate('uploader')
    ),
    writeDump(
      'users',
      User.find({}, '-password -email -verified -verifyToken -admin')
    ),
  ])

  signale.complete('JSON dumps written!')
}

if (DISABLE_DUMPS) {
  signale.warn('Nightly dumps are disabled!')
} else {
  signale.pending('Starting JSON dump task...')
  dumpTask()
  schedule('0 */12 * * *', async () => dumpTask())
}
