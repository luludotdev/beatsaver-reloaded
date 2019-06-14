import React, {
  Dispatch,
  FunctionComponent,
  MouseEvent,
  SetStateAction,
} from 'react'
import { Link } from 'react-router-dom'
import { ExtLink } from '../ExtLink'

interface IItemProps {
  to: string

  setActive: Dispatch<SetStateAction<boolean>>
}

export const NavbarItem: FunctionComponent<IItemProps> = ({
  to,
  children,
  setActive,
}) => (
  <Link className='navbar-item' to={to} onClick={() => setActive(false)}>
    {children}
  </Link>
)

interface IItemExtProps {
  href: string
}

export const NavbarItemExt: FunctionComponent<IItemExtProps> = ({
  href,
  children,
}) => (
  <ExtLink className='navbar-item' href={href}>
    {children}
  </ExtLink>
)

interface IClickableItemProps {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => any
}

export const NavbarClickableItem: FunctionComponent<IClickableItemProps> = ({
  onClick,
  children,
}) => (
  <a className='navbar-item' onClick={e => onClick(e)}>
    {children}
  </a>
)
