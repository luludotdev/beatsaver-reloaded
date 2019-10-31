import React, { FunctionComponent, useEffect, useState } from 'react'
import { formatDate } from '../../utils/formatDate'
import { Statistic } from './Statistic'

interface IStatsProps {
  map: IMapStats
  uploaded: IBeatmap['uploaded']
}

interface IFullProps {
  map: IBeatmap
  uploaded?: undefined
}

interface ICommonProps {
  hideTime?: boolean
}

type IProps = (IStatsProps | IFullProps) & ICommonProps
export const BeatmapStats: FunctionComponent<IProps> = ({
  map,
  uploaded: uploadedRaw,
  hideTime,
}) => {
  const uploaded = isFullMap(map) ? map.uploaded : uploadedRaw
  if (uploaded === undefined) throw new Error('Uploaded cannot be null!')

  const [dateStr, setDateStr] = useState<string>(formatDate(uploaded))
  useEffect(() => {
    const i = setInterval(() => {
      const newStr = formatDate(uploaded)
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
          hover={new Date(uploaded).toISOString()}
        />
      )}

      <Statistic
        type='num'
        emoji='💾'
        number={map.stats.downloads}
        hover='Downloads'
      />

      <Statistic
        type='num'
        emoji='👍'
        number={map.stats.upVotes}
        hover='Upvotes'
      />

      <Statistic
        type='num'
        emoji='👎'
        number={map.stats.downVotes}
        hover='Downvotes'
      />

      <Statistic
        type='num'
        emoji='💯'
        number={map.stats.rating}
        fixed={1}
        percentage={true}
        hover='Beatmap Rating'
      />
    </ul>
  )
}

// @ts-ignore
const isFullMap: (map: IMapStats | IBeatmap) => map is IBeatmap = map => {
  return (map as IBeatmap).downloadURL !== undefined
}
