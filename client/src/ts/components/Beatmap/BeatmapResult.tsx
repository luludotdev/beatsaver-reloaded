import React, { FunctionComponent, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { parseCharacteristics } from '../../utils/characteristics'
import { formatDate } from '../../utils/formatDate'
import { Image } from '../Image'
import { DiffTags } from './DiffTags'
import { BeatmapStats } from './Statistics'

interface IProps {
  map: IBeatmap
}

const BeatmapResult: FunctionComponent<IProps> = ({ map }) => {
  const [inViewRef, inView] = useInView({ rootMargin: '240px' })
  if (!inView) {
    return (
      <div ref={inViewRef} className='beatmap-result-hidden' id={map.key} />
    )
  }

  return (
    <div className='beatmap-result' id={map.key} ref={inViewRef}>
      <div className='cover'>
        <Link to={`/beatmap/${map.key}`}>
          <Image
            src={map.coverURL}
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
            style={{ marginBottom: 0 }}
            easy={map.metadata.difficulties.easy}
            normal={map.metadata.difficulties.normal}
            hard={map.metadata.difficulties.hard}
            expert={map.metadata.difficulties.expert}
            expertPlus={map.metadata.difficulties.expertPlus}
          />

          <div className='tags'>
            {parseCharacteristics(map.metadata.characteristics).map((x, i) => (
              <span key={`${x}:${i}`} className='tag is-dark'>
                {x}
              </span>
            ))}
          </div>
        </div>

        <div className='right'>
          <div className='stats'>
            <BeatmapStats map={map} hideTime={true} />
          </div>

          <a href={map.downloadURL}>Download</a>
        </div>
      </div>
    </div>
  )
}

export { BeatmapResult }
