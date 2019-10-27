import dateFormat from 'dateformat'
import { SEVEN_DAYS } from '../constants'

interface IInterval {
  label: string
  seconds: number
}

const intervals: readonly IInterval[] = [
  { label: 'year', seconds: 60 * 60 * 24 * 365 },
  { label: 'month', seconds: 60 * 60 * 24 * 31 },
  { label: 'week', seconds: 60 * 60 * 24 * 7 },
  { label: 'day', seconds: 60 * 60 * 24 },
  { label: 'hour', seconds: 60 * 60 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
]

const timeSince = (date: Date | string) => {
  const d = new Date(date)

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds === 0) return 'Just now'

  const interval = intervals.find(i => i.seconds < seconds)
  if (interval === undefined) return d.toISOString()

  const count = Math.floor(seconds / interval.seconds)
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
}

export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date

  return Date.now() - d.getTime() < SEVEN_DAYS
    ? timeSince(d)
    : dateFormat(d, 'yyyy/mm/dd')
}
