import React, { FunctionComponent, useState } from 'react'
import { canUseDom } from '../../utils/dom'
import { IBeatmapSearch } from './BeatmapAPI'
import { BeatmapAPI } from './BeatmapAPI'
import { BeatmapScroller } from './BeatmapScroller'

export const BeatmapList: FunctionComponent<IBeatmapSearch> = props => {
  const isFirefox = canUseDom()
    ? navigator.userAgent.toLowerCase().includes('firefox')
    : false

  const [showAutos, setShowAutos] = useState<boolean>(false)

  return (
    <>
      <div className='box'>
        <label className='checkbox'>
          <input
            type='checkbox'
            checked={showAutos}
            onChange={() => setShowAutos(!showAutos)}
          />
          &nbsp;Show auto-generated beatmaps
        </label>
      </div>

      <BeatmapAPI
        {...props}
        render={api => (
          <BeatmapScroller {...api} showAutos={showAutos} finite={isFirefox} />
        )}
      />
    </>
  )
}
