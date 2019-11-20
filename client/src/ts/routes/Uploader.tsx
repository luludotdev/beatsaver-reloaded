import { AxiosError } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { RouteComponentProps } from 'react-router-dom'
import { BeatmapList } from '../components/Beatmap'
import { Loader } from '../components/Loader'
import { TextPage } from '../components/TextPage'
import { axios } from '../utils/axios'
import { NotFound } from './NotFound'

interface IParams {
  id: string
}

export const Uploader: FunctionComponent<RouteComponentProps<IParams>> = ({
  match,
}) => {
  const userID = match.params.id
  const [user, setUser] = useState<IUserResponse | undefined | Error>(undefined)

  useEffect(() => {
    axios
      .get<IUserResponse>(`/users/find/${userID}`)
      .then(resp => {
        setUser(resp.data)
      })
      .catch(err => setUser(err))

    return () => {
      setUser(undefined)
    }
  }, [userID])

  if (user === undefined) return <Loader />
  if (user instanceof Error) {
    const error = user as AxiosError
    if (error.response && error.response.status === 404) {
      return <NotFound />
    }

    return (
      <TextPage title='Network Error'>
        <p>Failed to load users' beatmap info! Please try again later.</p>
        <p>If the problem persists, please alert a site admin.</p>
      </TextPage>
    )
  }

  return (
    <>
      <Helmet>
        <title>BeatSaver - Beatmaps by {user.username}</title>
      </Helmet>

      <div className='thin'>
        <h1 className='is-size-2 has-text-weight-light has-text-centered'>
          Beatmaps by {user.username}
        </h1>
        <br />
      </div>

      <BeatmapList type='uploader' query={userID} />
    </>
  )
}
