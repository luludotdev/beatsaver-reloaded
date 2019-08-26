import { join } from 'path'

export const CDN_PATH = join(__dirname, '..', 'cdn')
export const DUMP_PATH = join(CDN_PATH, 'dumps')
export const BEATSAVER_EPOCH = 1525132800

export const FILE_EXT_WHITELIST = [
  '.dat',
  '.json',
  '.egg',
  '.ogg',
  '.png',
  '.jpg',
  '.jpeg',
  '.srt',
]
