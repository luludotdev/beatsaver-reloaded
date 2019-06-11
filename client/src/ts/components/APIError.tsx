import React, { FunctionComponent } from 'react'
import { TextPage } from './TextPage'

interface IProps {
  error: Error
}

export const APIError: FunctionComponent<IProps> = ({ error }) => {
  console.error(error)

  return (
    <TextPage title='Error Loading Maps!'>
      <p>Something went wrong, please check back later.</p>
      <p>If the problem persists please alert a site adminstrator.</p>
    </TextPage>
  )
}
