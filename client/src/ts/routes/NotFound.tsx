import React, { FunctionComponent } from 'react'
import { TextPage } from '../components/TextPage'

export const NotFound: FunctionComponent = () => (
  <TextPage title='404'>
    <p>This page doesn't exist. Use the navbar to get back on track!</p>
  </TextPage>
)
