import React, { FunctionComponent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import { DiffTags } from './DiffTags'
import { BeatmapStats } from './Statistics'

import Placeholder from '../../../images/placeholder.svg'

interface IProps {
  map: IBeatmap
}

const BeatmapResult: FunctionComponent<IProps> = ({ map }) => {
  const [image, setImage] = useState(undefined as string | undefined)

  const characteristics = map.metadata.characteristics.map(characteristic =>
    characteristic
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
      .replace(/(  )/g, ' ')
  )

  useEffect(() => {
    fetch(map.coverURL)
      .then(resp => {
        if (resp.ok) setImage(map.coverURL)
        else setImage(undefined)
      })
      .catch(() => setImage(undefined))
  }, [])

  return (
    <div className='beatmap-result'>
      <div className='cover'>
        <Link to={`/beatmap/${map.key}`}>
          <img
            src={image || Placeholder}
            alt={`Artwork for ${map.name}`}
            draggable={false}
          />
        </Link>
      </div>

      <div className='beatmap-content'>
        <div className='outer'>
          <div className='details'>
            <h1 className='is-size-3 has-text-weight-light'>
              <Link to={`/beatmap/${map.key}`}>{map.name}</Link>
            </h1>
            <h2 className='is-size-5 has-text-weight-normal'>
              Uploaded by{' '}
              <Link to={`/uploader/${map.uploader._id}`}>
                {map.uploader.username}
              </Link>{' '}
              <span className='uploaded'>{formatDate(map.uploaded)}</span>
            </h2>
          </div>

          <DiffTags
            easy={map.metadata.difficulties.easy}
            normal={map.metadata.difficulties.normal}
            hard={map.metadata.difficulties.hard}
            expert={map.metadata.difficulties.expert}
            expertPlus={map.metadata.difficulties.expertPlus}
          />
        </div>

        <div className='stats'>
          <BeatmapStats map={map} hideTime={true} />
        </div>
      </div>
    </div>
  )
}

export { BeatmapResult }
