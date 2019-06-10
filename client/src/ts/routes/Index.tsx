import React, { FunctionComponent } from 'react'
import { ExtLink } from '../components/ExtLink'
import { TextPage } from '../components/TextPage'

export const Index: FunctionComponent = () => (
  <TextPage title='BeatSaver'>
    <p>Beat Saber's #1 unofficial beatmap distributor!</p>
    <hr />

    <p>
      <b>Not everything is finished yet with the rewrite, please be patient.</b>
      <br />
      See{' '}
      <ExtLink href='https://github.com/lolPants/beatsaver-reloaded/issues/1'>
        this GitHub issue
      </ExtLink>{' '}
      for more info.
    </p>
  </TextPage>
)
