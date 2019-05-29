import { push as pushFn } from 'connected-react-router'
import dateFormat from 'dateformat'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import React, { FunctionComponent, MouseEvent, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IBeatmap } from '../../remote/beatmap'

import Missing from '../../../images/missing_image.png'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')
const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

interface IConnectedProps {
  push: typeof pushFn
}

interface IPassedProps {
  map: IBeatmap
}

type IProps = IConnectedProps & IPassedProps

const BeatmapResult: FunctionComponent<IProps> = ({ map, push }) => {
  const [imageError, setImageError] = useState(false)

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLAnchorElement) return
    else push(`/beatmap/${map.key}`)
  }

  const uploaded = new Date(map.uploaded)
  const uploadedStr =
    Date.now() - uploaded.getTime() < SEVEN_DAYS
      ? timeAgo.format(uploaded)
      : dateFormat(uploaded, 'yyyy/mm/dd')

  return (
    <div className='beatmap-result' onClick={e => handleClick(e)}>
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
          <h2 className='is-size-5 has-text-weight-normal'>
            Uploaded by{' '}
            <Link to={`/uploader/${map.uploader._id}`}>
              {map.uploader.username}
            </Link>{' '}
            <span className='uploaded'>{uploadedStr}</span>
          </h2>
        </div>

        <div className='tags'>
          {map.metadata.difficulties.easy ? (
            <span className='tag is-easy'>Easy</span>
          ) : null}

          {map.metadata.difficulties.normal ? (
            <span className='tag is-normal'>Normal</span>
          ) : null}

          {map.metadata.difficulties.hard ? (
            <span className='tag is-hard'>Hard</span>
          ) : null}

          {map.metadata.difficulties.expert ? (
            <span className='tag is-expert'>Expert</span>
          ) : null}

          {map.metadata.difficulties.expertPlus ? (
            <span className='tag is-expert-plus'>Expert+</span>
          ) : null}
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
