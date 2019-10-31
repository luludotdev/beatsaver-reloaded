import { saveAs } from 'file-saver'
import sanitize from 'sanitize-filename'
import { mutate } from 'swr'

export class DownloadError extends Error {
  public code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

export const downloadBeatmap = async (
  map: IBeatmap,
  direct: boolean = false
) => {
  const downloadURL = direct ? map.directDownload : map.downloadURL
  const resp = await fetch(downloadURL)

  mutate(`/stats/key/${map.key}`, {
    ...map,
    stats: { ...map.stats, downloads: map.stats.downloads + 1 },
  })

  if (!resp.ok) throw new DownloadError('download failed', resp.status)
  const blob = await resp.blob()

  const songName = sanitize(map.metadata.songName)
  const authorName = sanitize(map.metadata.levelAuthorName)
  const filename = `${map.key} (${songName} - ${authorName}).zip`

  saveAs(blob, filename)
}
