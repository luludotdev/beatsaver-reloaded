import React, { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { IBeatmap } from '../../remote/beatmap'

import Missing from '../../../images/missing_image.png'

interface IProps {
  map: IBeatmap
}

export const BeatmapResult: FunctionComponent<IProps> = ({ map }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className='beatmap-result'>
      <h1 className='is-size-3 has-text-weight-light'>
        <Link to={`/beatmap/${map.key}`}>{map.name}</Link>
      </h1>

      <div className='beatmap-container'>
        <div className='artwork'>
          <img
            src={imageError ? Missing : map.coverURL}
            alt={`Artwork for ${map.name}`}
            onError={() => setImageError(true)}
          />
        </div>

        <div className='details'>
          <h2 className='is-size-5'>
            Uploaded by{' '}
            <Link to={`/uploader/${map.uploader._id}`}>
              {map.uploader.username}
            </Link>
          </h2>
        </div>
      </div>
    </div>
  )
}
