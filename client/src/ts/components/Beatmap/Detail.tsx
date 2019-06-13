import { AxiosError } from 'axios'
import dateFormat from 'dateformat'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from '../../../images/placeholder.svg'
import { IBeatmap } from '../../remote/beatmap'
import { NotFound } from '../../routes/NotFound'
import { axios } from '../../utils/axios'
import { Loader } from '../Loader'
import { TextPage } from '../TextPage'

interface IProps {
  mapKey: string
}

export const BeatmapDetail: FunctionComponent<IProps> = ({ mapKey }) => {
  const [beatmap, setBeatmap] = useState(undefined as
    | IBeatmap
    | undefined
    | Error)

  useEffect(() => {
    axios
      .get<IBeatmap>(`/maps/detail/${mapKey}`)
      .then(resp => {
        setBeatmap(resp.data)
      })
      .catch(err => setBeatmap(err))

    return () => {
      setBeatmap(undefined)
    }
  }, [mapKey])

  if (beatmap === undefined) return <Loader />
  if (beatmap instanceof Error) {
    const error = beatmap as AxiosError
    if (error.response && error.response.status === 404) {
      return <NotFound />
    }

    return (
      <TextPage title='Network Error'>
        <p>Failed to load beatmap info! Please try again later.</p>
        <p>If the problem persists, please alert a site admin.</p>
      </TextPage>
    )
  }

  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')
  const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

  const uploaded = new Date(beatmap.uploaded)
  const uploadedStr =
    Date.now() - uploaded.getTime() < SEVEN_DAYS
      ? timeAgo.format(uploaded)
      : dateFormat(uploaded, 'yyyy/mm/dd')

  return (
    <>
      <div className='beatmap-detail'>
        <div className='cover'>
          <img
            src={beatmap.coverURL || Placeholder}
            alt={`Artwork for ${beatmap.name}`}
            draggable={false}
          />
        </div>

        <div className='beatmap-content'>
          <div className='details'>
            <h1 className='is-size-3 has-text-weight-light'>{beatmap.name}</h1>
            <h2 className='is-size-5 has-text-weight-normal'>
              Uploaded by{' '}
              <Link to={`/uploader/${beatmap.uploader._id}`}>
                {beatmap.uploader.username}
              </Link>{' '}
              <span className='uploaded'>{uploadedStr}</span>
            </h2>
          </div>

          <div className='tags'>
            {beatmap.metadata.difficulties.easy ? (
              <span className='tag is-easy'>Easy</span>
            ) : null}

            {beatmap.metadata.difficulties.normal ? (
              <span className='tag is-normal'>Normal</span>
            ) : null}

            {beatmap.metadata.difficulties.hard ? (
              <span className='tag is-hard'>Hard</span>
            ) : null}

            {beatmap.metadata.difficulties.expert ? (
              <span className='tag is-expert'>Expert</span>
            ) : null}

            {beatmap.metadata.difficulties.expertPlus ? (
              <span className='tag is-expert-plus'>Expert+</span>
            ) : null}
          </div>

          <h2 className='is-size-5 has-text-weight-normal'>
            {beatmap.metadata.songName}
          </h2>
          <h2 className='is-size-5 has-text-weight-normal'>
            {beatmap.metadata.songSubName}
          </h2>
          <h3 className='is-size-7 has-text-weight-normal'>
            Song Author: {beatmap.metadata.songAuthorName}
          </h3>
          <h3 className='is-size-7 has-text-weight-normal'>
            Level Author: {beatmap.metadata.levelAuthorName}
          </h3>
          <h3 className='is-size-7 has-text-weight-normal'>
            BPM {beatmap.metadata.bpm}
          </h3>

          <div className='description'>{beatmap.description}</div>
        </div>

        <div className='links'>
          <a
            className='button'
            href={beatmap.downloadURL}
            style={{ pointerEvents: 'all', fontSize: '2em' }}
          >
            Download
          </a>
        </div>
      </div>
    </>
  )
}
