import sanitize from 'sanitize-filename'

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
  if (!resp.ok) throw new DownloadError('download failed', resp.status)

  const blob = await resp.blob()
  const blobURL = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = blobURL
  a.download = sanitize(
    `${map.key} (${map.metadata.songName} - ${map.metadata.levelAuthorName}).zip`
  )

  a.click()
  a.remove()
  URL.revokeObjectURL(blobURL)
}
