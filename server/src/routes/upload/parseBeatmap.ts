import AdmZIP from 'adm-zip'
import { createHash } from 'crypto'
import imageSize from 'image-size'
import { validJSON } from '../../utils/json'
import { getDataPromise } from '../../utils/zip'

import fileType = require('file-type')
import {
  ERR_BEATMAP_COVER_INVALID,
  ERR_BEATMAP_COVER_NOT_FOUND,
  ERR_BEATMAP_COVER_NOT_SQUARE,
  ERR_BEATMAP_COVER_TOO_SMOL,
  ERR_BEATMAP_DIFF_NOT_FOUND,
  ERR_BEATMAP_INFO_INVALID,
  ERR_BEATMAP_INFO_NOT_FOUND,
} from './errors'

export const parseBeatmap: (
  zipBuf: Buffer
) => Promise<{ parsed: IParsedBeatmap; cover: Buffer }> = async zipBuf => {
  const zip = new AdmZIP(zipBuf)

  const info = zip.getEntry('info.dat')
  if (info === null) throw ERR_BEATMAP_INFO_NOT_FOUND

  const infoDAT = await getDataPromise(info, true)
  if (!validJSON(infoDAT)) throw ERR_BEATMAP_INFO_INVALID
  const infoJSON: IBeatmapInfo = JSON.parse(infoDAT)

  const coverEntry = zip.getEntry(infoJSON._coverImageFilename)
  if (coverEntry === null) {
    throw ERR_BEATMAP_COVER_NOT_FOUND(infoJSON._coverImageFilename)
  }

  const cover = await getDataPromise(coverEntry)
  const coverType = fileType(cover)
  if (
    coverType === undefined ||
    (coverType.mime !== 'image/png' && coverType.mime !== 'image/jpeg')
  ) {
    throw ERR_BEATMAP_COVER_INVALID
  }

  const size = imageSize(cover)
  if (size.width !== size.height) throw ERR_BEATMAP_COVER_NOT_SQUARE
  if (size.width < 256 || size.height < 256) throw ERR_BEATMAP_COVER_TOO_SMOL

  const difficulties = ([] as IDifficultyBeatmap[]).concat(
    ...infoJSON._difficultyBeatmapSets.map(x => x._difficultyBeatmaps)
  )

  for (const diff of difficulties) {
    const diffEntry = zip.getEntry(diff._beatmapFilename)
    if (diffEntry === null) {
      throw ERR_BEATMAP_DIFF_NOT_FOUND(diff._beatmapFilename)
    }
  }

  const diffBuffers = await Promise.all(
    difficulties.map(x => getDataPromise(zip.getEntry(x._beatmapFilename)))
  )

  const hash = createHash('sha1')
  hash.update(infoDAT)
  for (const b of diffBuffers) {
    hash.update(b)
  }

  const sha1 = hash.digest('hex')
  const parsed: IParsedBeatmap = {
    hash: sha1,

    metadata: {
      levelAuthorName: infoJSON._levelAuthorName,
      songAuthorName: infoJSON._songAuthorName,
      songName: infoJSON._songName,
      songSubName: infoJSON._songSubName,

      bpm: infoJSON._beatsPerMinute,
    },

    coverExt: `.${coverType.ext}`,
  }

  return { parsed, cover }
}
