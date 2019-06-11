import React, { FunctionComponent, lazy, Suspense } from 'react'
import { Loader } from '../Loader'
import { IBeatmapSearch } from './BeatmapAPI'
export * from './Detail'

const BeatmapAPI = lazy(() => import('./BeatmapAPI'))
const BeatmapScroller = lazy(() => import('./BeatmapScroller'))

export const BeatmapList: FunctionComponent<IBeatmapSearch> = props => {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')

  return (
    <Suspense fallback={<Loader />}>
      <BeatmapAPI
        {...props}
        render={api => <BeatmapScroller {...api} finite={isFirefox} />}
      />
    </Suspense>
  )
}
