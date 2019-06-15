import React, { FunctionComponent } from 'react'

interface IDropdownProps {
  label: string
}

export const NavbarDropdown: FunctionComponent<IDropdownProps> = ({
  label,
  children,
}) => (
  <div className='navbar-item has-dropdown is-hoverable'>
    <a className='navbar-link'>{label}</a>
    <div className='navbar-dropdown'>{children}</div>
  </div>
)

export const NavbarDropdownDivider: FunctionComponent = () => (
  <hr className='navbar-divider' />
)
