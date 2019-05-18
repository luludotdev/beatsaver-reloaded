import React, { FunctionComponent } from 'react'
import { IBeatmap } from '../../remote/beatmap'

export const BeatmapResult: FunctionComponent<IBeatmap> = map => (
  <div className='content'>
    <h1>{map.name}</h1>
    <h3>Uploaded by {map.uploader.username}</h3>
  </div>
)
