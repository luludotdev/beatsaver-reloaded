import React, { FunctionComponent } from 'react'
import { canUseDom } from '../../utils/dom'
import { IBeatmapSearch } from './BeatmapAPI'
import { BeatmapAPI } from './BeatmapAPI'
import { BeatmapScroller } from './BeatmapScroller'

export const BeatmapList: FunctionComponent<IBeatmapSearch> = props => {
  const isFirefox = canUseDom()
    ? navigator.userAgent.toLowerCase().includes('firefox')
    : false

  return (
    <BeatmapAPI
      {...props}
      render={api => <BeatmapScroller {...api} finite={isFirefox} />}
    />
  )
}
