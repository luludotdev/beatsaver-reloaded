import React, { FunctionComponent } from 'react'

interface IProps {
  href: string
  className?: string
}

export const ExtLink: FunctionComponent<IProps> = ({
  href,
  className,
  children,
}) => (
  <a
    href={href}
    className={className}
    target='_blank'
    rel='noopener noreferrer'
  >
    {children}
  </a>
)
