import { push as pushFn } from 'connected-react-router'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import React, {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useState,
} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { IBeatmap } from '../../remote/beatmap'

import Placeholder from '../../../images/placeholder.svg'
import { getUploadedString } from '../../utils/utils'

TimeAgo.addLocale(en)

interface IConnectedProps {
  push: typeof pushFn
}

interface IPassedProps {
  map: IBeatmap
}

type IProps = IConnectedProps & IPassedProps

const BeatmapResult: FunctionComponent<IProps> = ({ map, push }) => {
  const [image, setImage] = useState(undefined as string | undefined)

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLAnchorElement) return
    else push(`/beatmap/${map.key}`)
  }

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
    <div className='beatmap-result' onClick={e => handleClick(e)}>
      <div className='cover'>
        <img
          src={image || Placeholder}
          alt={`Artwork for ${map.name}`}
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
            <span className='uploaded'>{getUploadedString(map)}</span>
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
