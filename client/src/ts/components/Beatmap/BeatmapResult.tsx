import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { IBeatmap } from '../../remote/beatmap'

interface IProps {
  map: IBeatmap
}

export const BeatmapResult: FunctionComponent<IProps> = ({ map }) => (
  <div className='beatmap-result'>
    <h1 className='is-size-3 has-text-weight-light'>
      <Link to={`/beatmap/${map.key}`}>{map.name}</Link>
    </h1>

    <div className='beatmap-container'>
      <div className='artwork'>
        <img
          src='https://www.americanrealtyarlington.com/wp-content/uploads/2016/06/us-placeholder-square-1024x1024.jpg'
          alt={`Artwork for ${map.name}`}
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
