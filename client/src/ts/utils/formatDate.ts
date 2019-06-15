import dateFormat from 'dateformat'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { SEVEN_DAYS } from '../constants'

TimeAgo.addLocale(en)
export const timeAgo = new TimeAgo('en-US')

export const formatDate = (d: Date) =>
  Date.now() - d.getTime() < SEVEN_DAYS
    ? timeAgo.format(d)
    : dateFormat(d, 'yyyy/mm/dd')
