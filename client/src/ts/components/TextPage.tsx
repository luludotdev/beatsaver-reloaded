import React, { FunctionComponent } from 'react'

interface IProps {
  title: string
}

export const TextPage: FunctionComponent<IProps> = ({ title, children }) => (
  <div className='thin'>
    <h1 className='is-size-1 has-text-weight-light'>{title}</h1>
    {children}
  </div>
)
