import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { BeatmapDetail } from '../components/Beatmap'

interface IParams {
  key: string
}

export const Beatmap: FunctionComponent<RouteComponentProps<IParams>> = ({
  match,
}) => <BeatmapDetail mapKey={match.params.key} />
