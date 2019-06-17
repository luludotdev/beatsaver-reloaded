import React, { FunctionComponent } from 'react'
import { IBeatmapSearch } from './BeatmapAPI'
import { BeatmapAPI } from './BeatmapAPI'
import { BeatmapScroller } from './BeatmapScroller'

export * from './Detail'

export const BeatmapList: FunctionComponent<IBeatmapSearch> = props => {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')

  return (
    <BeatmapAPI
      {...props}
      render={api => <BeatmapScroller {...api} finite={isFirefox} />}
    />
  )
}
