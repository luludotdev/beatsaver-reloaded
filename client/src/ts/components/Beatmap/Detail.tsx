import { AxiosError } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from '../../../images/placeholder.svg'
import { IBeatmap } from '../../remote/beatmap'
import { NotFound } from '../../routes/NotFound'
import { axios } from '../../utils/axios'
import { getUploadedString } from '../../utils/utils'
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

        <div className='beatmap-content-container'>
          <div className='beatmap-content'>
            <div className='details'>
              <h1 className='is-size-3 has-text-weight-light'>
                {beatmap.name}
              </h1>
              <h2 className='is-size-5 has-text-weight-normal'>
                Uploaded by{' '}
                <Link to={`/uploader/${beatmap.uploader._id}`}>
                  {beatmap.uploader.username}
                </Link>{' '}
                <span className='uploaded'>{getUploadedString(beatmap)}</span>
              </h2>
            </div>
            <div className='stats'>
              <span className='stat'>
                {beatmap.stats.downloads.toLocaleString()}
                <i className='fas fa-download' />
              </span>
              <span className='stat'>
                {beatmap.stats.upVotes.toLocaleString()}
                <i className='fas fa-thumbs-up' />
              </span>
              <span className='stat'>
                {beatmap.stats.downVotes.toLocaleString()}
                <i className='fas fa-thumbs-down' />
              </span>
              <span className='stat'>
                {beatmap.stats.rating.toLocaleString()}
                <i className='fas fa-percent' />
              </span>
              <span className='stat'>
                {beatmap.stats.plays.toLocaleString()}
                <i className='fas fa-play' />
              </span>
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

            <div className='map-info'>
              <table>
                <tbody>
                  <tr>
                    <td>SONG NAME</td>
                    <td>{beatmap.metadata.songName}</td>
                    <td>SONG SUB NAME</td>
                    <td>{beatmap.metadata.songSubName}</td>
                  </tr>
                  <tr>
                    <td>SONG AUTHOR NAME</td>
                    <td>{beatmap.metadata.songAuthorName}</td>
                    <td>LEVEL AUTHOR NAME</td>
                    <td>{beatmap.metadata.levelAuthorName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='description'>{beatmap.description}</div>
            <div className='key'>Key: {beatmap.key}</div>
          </div>

          <div className='links'>
            <a
              className='button'
              href={beatmap.downloadURL}
              style={{ pointerEvents: 'all' }}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
