import React, { FunctionComponent } from 'react'
import Helmet from 'react-helmet'

interface IProps {
  title: string
  pageTitle?: string
}

export const TextPage: FunctionComponent<IProps> = ({
  title,
  pageTitle,
  children,
}) => (
  <>
    <Helmet>
      <title>{pageTitle || 'BeatSaver'}</title>
    </Helmet>

    <div className='thin'>
      <h1 className='is-size-1 has-text-weight-light'>{title}</h1>
      {children}
    </div>
  </>
)
