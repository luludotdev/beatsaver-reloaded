import { AxiosError } from 'axios'
import chunk from 'chunk'
import React, { FunctionComponent, useEffect, useState } from 'react'
import nl2br from 'react-nl2br'
import { Link } from 'react-router-dom'
import { NotFound } from '../../routes/NotFound'
import { axios } from '../../utils/axios'
import { Loader } from '../Loader'
import { TextPage } from '../TextPage'
import { DiffTags } from './DiffTags'
import { BeatmapStats } from './Statistics'

import Placeholder from '../../../images/placeholder.svg'

interface IProps {
  mapKey: string
}

export const BeatmapDetail: FunctionComponent<IProps> = ({ mapKey }) => {
  const [map, setMap] = useState(undefined as IBeatmap | undefined | Error)
  const [image, setImage] = useState(undefined as string | undefined)

  useEffect(() => {
    axios
      .get<IBeatmap>(`/maps/detail/${mapKey}`)
      .then(resp => {
        setMap(resp.data)

        fetch(resp.data.coverURL)
          .then(r => {
            if (r.ok) setImage(resp.data.coverURL)
            else setImage(undefined)
          })
          .catch(() => setImage(undefined))
      })
      .catch(err => setMap(err))

    return () => {
      setMap(undefined)
    }
  }, [mapKey])

  if (map === undefined) return <Loader />
  if (map instanceof Error) {
    const error = map as AxiosError
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
      <div className='detail-artwork'>
        <img
          src={image || Placeholder}
          alt={`Artwork for ${map.name}`}
          draggable={false}
        />
      </div>

      <div className='detail-content'>
        <h1 className='is-size-1'>{map.name}</h1>
        <h2 className='is-size-4'>
          Uploaded by{' '}
          <Link to={`/uploader/${map.uploader._id}`}>
            {map.uploader.username}
          </Link>
        </h2>

        <div className='box'>
          <div className='left'>
            <div className='metadata'>
              <Metadata
                metadata={[
                  ['Song Name', map.metadata.songName],
                  ['Song Sub Name', map.metadata.songSubName],
                  ['Song Author Name', map.metadata.songAuthorName],
                  ['Level Author Name', map.metadata.levelAuthorName],
                ]}
              />
            </div>

            <div className='description'>
              {map.description ? (
                nl2br(map.description)
              ) : (
                <i>No description given.</i>
              )}
            </div>

            <DiffTags
              easy={map.metadata.difficulties.easy}
              normal={map.metadata.difficulties.normal}
              hard={map.metadata.difficulties.hard}
              expert={map.metadata.difficulties.expert}
              expertPlus={map.metadata.difficulties.expertPlus}
            />
          </div>

          <div className='right'>
            <BeatmapStats map={map} />
          </div>
        </div>

        <div className='buttons'>
          <a href={map.downloadURL}>Download</a>
          {/* <a href={`beatsaver://${map.key}`}>OneClick&trade; Install</a> */}
          {/* <a href='/'>View on BeastSaber</a> */}
          {/* <a href='/'>Preview</a> */}
        </div>
      </div>
    </>
  )
}

interface IMetadataProps {
  metadata: ReadonlyArray<readonly [string, any]>
}

export const Metadata: FunctionComponent<IMetadataProps> = ({ metadata }) => {
  const chunks = chunk(metadata, 2)

  return (
    <>
      {chunks.map((x, i) => (
        <div key={i} className='col'>
          <table>
            <tbody>
              {x.map(([k, v], j) => (
                <tr key={j}>
                  <td>{k}</td>
                  <td className={v ? undefined : 'hidden'}>{v || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}
