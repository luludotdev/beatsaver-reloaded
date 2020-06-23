import React, { FunctionComponent, useEffect, useState } from 'react'
import { formatDate } from '../../utils/formatDate'
import { Statistic } from './Statistic'

interface IProps {
  hideTime?: boolean
  map: IBeatmap
  stats?: IMapStats
}

export const BeatmapStats: FunctionComponent<IProps> = ({
  hideTime,

  map,
  stats,
}) => {
  const [dateStr, setDateStr] = useState<string>(formatDate(map.uploaded))
  useEffect(() => {
    const i = setInterval(() => {
      const newStr = formatDate(map.uploaded)
      if (dateStr !== newStr) setDateStr(newStr)
    }, 1000 * 30)

    return () => clearInterval(i)
  }, [])

  return (
    <ul>
      <Statistic type='text' emoji='🔑' text={map.key} />

      {hideTime ? null : (
        <Statistic
          type='text'
          emoji='🕔'
          text={dateStr}
          hover={new Date(map.uploaded).toISOString()}
        />
      )}

      <Statistic
        type='num'
        emoji='💾'
        number={stats?.stats.downloads ?? map.stats.downloads}
        hover='Downloads'
      />

      <Statistic
        type='num'
        emoji='👍'
        number={stats?.stats.upVotes ?? map.stats.upVotes}
        hover='Upvotes'
      />

      <Statistic
        type='num'
        emoji='👎'
        number={stats?.stats.downVotes ?? map.stats.downVotes}
        hover='Downvotes'
      />

      <Statistic
        type='num'
        emoji='💯'
        number={stats?.stats.rating ?? map.stats.rating}
        fixed={1}
        percentage={true}
        hover='Beatmap Rating'
      />

      {map.metadata.duration && map.metadata.duration > 0 ? (
        <Statistic
          type='text'
          emoji='⏱'
          text={convertSecondsToTime(map.metadata.duration)}
          hover='Beatmap Duration'
        />
      ) : null}
    </ul>
  )
}

const convertSecondsToTime: (duration: number) => string = duration => {
  const hours = Math.trunc(duration / 3600)
  const minutes = Math.trunc((duration % 3600) / 60)
  const seconds = Math.trunc(duration % 60)

  const HH = hours.toString().padStart(2, '0')
  const MM = minutes.toString().padStart(2, '0')
  const SS = seconds.toString().padStart(2, '0')

  return hours > 0 ? `${HH}:${MM}:${SS}` : `${MM}:${SS}`
}
