import React, { FunctionComponent, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { connect, MapStateToProps } from 'react-redux'
import { Link } from 'react-router-dom'
import { downloadBeatmap, DownloadError } from '../../remote/download'
import { IState } from '../../store'
import {
  IAudioState,
  PreviewBeatmap,
  previewBeatmap as previewBeatmapFn,
  StopPreview,
  stopPreview as stopPreviewFn,
} from '../../store/audio'
import { parseCharacteristics } from '../../utils/characteristics'
import { formatDate } from '../../utils/formatDate'
import { Image } from '../Image'
import { DiffTags } from './DiffTags'
import { BeatmapStats } from './Statistics'

interface IConnectedProps {
  preview: IAudioState
}

interface IDispatchProps {
  previewBeatmap: PreviewBeatmap
  stopPreview: StopPreview
}

interface IPassedProps {
  map: IBeatmap
}

type IProps = IConnectedProps & IDispatchProps & IPassedProps
const BeatmapResult: FunctionComponent<IProps> = ({
  map,
  preview,
  previewBeatmap,
  stopPreview,
}) => {
  const [dateStr, setDateStr] = useState<string>(formatDate(map.uploaded))
  useEffect(() => {
    const i = setInterval(() => {
      const newStr = formatDate(map.uploaded)
      if (dateStr !== newStr) setDateStr(newStr)
    }, 1000 * 30)

    return () => clearInterval(i)
  }, [])

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
              <span
                className='uploaded'
                title={new Date(map.uploaded).toISOString()}
              >
                {dateStr}
              </span>
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
            {parseCharacteristics(map.metadata.characteristics).map(
              ({ name }, i) => (
                <span key={`${name}:${i}`} className='tag is-dark'>
                  {name}
                </span>
              )
            )}
          </div>
        </div>

        <div className='right'>
          <div className='stats'>
            <BeatmapStats map={map} hideTime={true} />
          </div>

          <div className='is-button-group'>
            <a
              href='/'
              className={
                !preview.loading
                  ? undefined
                  : preview.key === map.key
                  ? 'loading disabled'
                  : 'disabled'
              }
              onClick={e => {
                e.preventDefault()

                if (preview.state === 'playing' && preview.key === map.key) {
                  stopPreview()
                } else {
                  previewBeatmap(map)
                }
              }}
            >
              {preview.key !== map.key
                ? 'Preview'
                : preview.loading
                ? 'Preview'
                : preview.error !== null
                ? 'Playback error!'
                : 'Stop Preview'}
            </a>
            <a href={`beatsaver://${map.key}`}>OneClick&trade;</a>
            <a
              href='/'
              onClick={e => {
                e.preventDefault()
                downloadBeatmap(map).catch((err: DownloadError) => {
                  alert(`Download Failed with code ${err.code}!`)
                })
              }}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps: MapStateToProps<
  IConnectedProps,
  IPassedProps,
  IState
> = state => ({
  preview: state.audio,
})

const mapDispatchToProps: IDispatchProps = {
  previewBeatmap: previewBeatmapFn,
  stopPreview: stopPreviewFn,
}

const ConnectedBeatmapResult = connect(
  mapStateToProps,
  mapDispatchToProps
)(BeatmapResult)

export { ConnectedBeatmapResult as BeatmapResult }
