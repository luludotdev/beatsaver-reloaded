import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { BeatmapList } from '../components/Beatmap'

interface IParams {
  id: string
}

export const Uploader: FunctionComponent<RouteComponentProps<IParams>> = ({
  match,
}) => <BeatmapList type='uploader' query={match.params.id} />
