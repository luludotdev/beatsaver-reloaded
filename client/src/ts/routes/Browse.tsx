import React, { FunctionComponent } from 'react'
import { BeatmapList } from '../components/Beatmap'

export const Latest: FunctionComponent = () => <BeatmapList type='latest' />
export const Hot: FunctionComponent = () => <BeatmapList type='hot' />
export const Rating: FunctionComponent = () => <BeatmapList type='rating' />
export const Plays: FunctionComponent = () => <BeatmapList type='plays' />
export const Downloads: FunctionComponent = () => (
  <BeatmapList type='downloads' />
)
