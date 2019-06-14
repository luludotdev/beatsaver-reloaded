import { AxiosError } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
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

  return (
    <>
      <pre>{JSON.stringify(beatmap, null, 2)}</pre>
      <div
        style={{
          alignItems: 'center',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          pointerEvents: 'none',
          position: 'fixed',
          right: 0,
          top: 0,
        }}
      >
        <a
          className='button'
          href={beatmap.downloadURL}
          style={{ pointerEvents: 'all', fontSize: '2em' }}
        >
          Download
        </a>
      </div>
    </>
  )
}
