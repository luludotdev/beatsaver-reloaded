import React, { FunctionComponent, Suspense } from 'react'
import { RouteComponentProps } from 'react-router'
import { BeatmapDetail } from '../components/Beatmap'
import { Loader } from '../components/Loader'

interface IParams {
  key: string
}

export const Beatmap: FunctionComponent<RouteComponentProps<IParams>> = ({
  match,
}) => (
  <Suspense fallback={<Loader />}>
    <BeatmapDetail mapKey={match.params.key} />
  </Suspense>
)
