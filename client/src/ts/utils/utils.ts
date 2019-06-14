import dateFormat from 'dateformat'
import TimeAgo from 'javascript-time-ago'
import { IBeatmap } from '../remote/beatmap'

export const getUploadedString = (beatmap: IBeatmap): string => {
  const timeAgo = new TimeAgo('en-US')
  const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

  const uploaded = new Date(beatmap.uploaded)
  const uploadedStr =
    Date.now() - uploaded.getTime() < SEVEN_DAYS
      ? timeAgo.format(uploaded)
      : dateFormat(uploaded, 'yyyy/mm/dd')

  return uploadedStr
}
