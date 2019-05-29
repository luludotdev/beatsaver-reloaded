import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { IBeatmap } from '../../remote/beatmap'

import { connect } from 'react-redux'
import Missing from '../../../images/missing_image.png'

interface IConnectedProps {
  push: typeof pushFn
}

interface IPassedProps {
  map: IBeatmap
}

type IProps = IConnectedProps & IPassedProps

const BeatmapResult: FunctionComponent<IProps> = ({ map, push }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className='beatmap-result' onClick={() => push(`/beatmap/${map.key}`)}>
      <div className='cover'>
        <img
          src={imageError ? Missing : map.coverURL}
          alt={`Artwork for ${map.name}`}
          onError={() => setImageError(true)}
          draggable={false}
        />
      </div>

      <div className='beatmap-content'>
        <div className='details'>
          <h1 className='is-size-3 has-text-weight-light'>{map.name}</h1>
        </div>

        <div className='tags'>
          <span className='tag is-easy'>Easy</span>
          <span className='tag is-normal'>Normal</span>
          <span className='tag is-hard'>Hard</span>
          <span className='tag is-expert'>Expert</span>
          <span className='tag is-expert-plus'>Expert+</span>
        </div>
      </div>
    </div>
  )
}

const ConnectedBeatmapResult = connect(
  null,
  { push: pushFn }
)(BeatmapResult)

export { ConnectedBeatmapResult as BeatmapResult }
