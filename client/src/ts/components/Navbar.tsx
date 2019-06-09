import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, MouseEvent, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { Link } from 'react-router-dom'
import { IState } from '../store'
import { IUser, logout as logoutFn } from '../store/user'

import Logo from '../../images/beat_saver_logo_white.png'
import { ExtLink } from './ExtLink'

interface IProps {
  user: IUser | null | undefined

  logout: typeof logoutFn
  push: typeof pushFn
}

const Navbar: FunctionComponent<IProps> = ({ user, logout, push }) => {
  const [active, setActive] = useState(false)

  const toggle = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setActive(!active)
  }

  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    push('/')
    logout()
  }

  return (
    <nav className='navbar has-shadow is-dark is-fixed-top'>
      <div className='container'>
        <div className='navbar-brand'>
          <Link to='/' className='navbar-item'>
            <img src={Logo} alt='BeatSaver' />
          </Link>

          <a
            role='button'
            onClick={e => toggle(e)}
            className={`navbar-burger${active ? ' is-active' : ''}`}
            aria-label='menu'
            aria-expanded={active.valueOf()}
          >
            <span aria-hidden='true' />
            <span aria-hidden='true' />
            <span aria-hidden='true' />
          </a>
        </div>

        <div className={`navbar-menu${active ? ' is-active' : ''}`}>
          <div className='navbar-start'>
            <Link className='navbar-item' to='/browse/latest'>
              Latest
            </Link>

            <NavbarDropdown label='Sort By'>
              <Link className='navbar-item' to='/browse/hot'>
                Hot
              </Link>

              <Link className='navbar-item' to='/browse/downloads'>
                Downloads
              </Link>

              <Link className='navbar-item' to='/browse/plays'>
                Plays
              </Link>
            </NavbarDropdown>

            <Link className='navbar-item' to='/search'>
              Search
            </Link>

            <div className='navbar-item' style={{ userSelect: 'none' }}>
              |
            </div>

            <ExtLink className='navbar-item' href='https://bsaber.com'>
              BeastSaber
            </ExtLink>

            <ExtLink className='navbar-item' href='https://scoresaber.com'>
              ScoreSaber
            </ExtLink>

            <NavbarDropdown label='Modding'>
              <ExtLink
                className='navbar-item'
                href='https://bsmg.wiki/beginners-guide'
              >
                Modding Guide
              </ExtLink>

              <ExtLink
                className='navbar-item'
                href='https://discord.gg/beatsabermods'
              >
                Modding Discord
              </ExtLink>

              <ExtLink className='navbar-item' href='https://bsmg.wiki/'>
                Community Wiki
              </ExtLink>
            </NavbarDropdown>
          </div>

          <div className='navbar-end'>
            {!user ? (
              <Link className='navbar-item' to='/auth/login'>
                Login
              </Link>
            ) : (
              <>
                <Link className='navbar-item' to='/user/upload'>
                  Upload
                </Link>

                <NavbarDropdown label={user.username}>
                  <a className='navbar-item' onClick={e => handleLogout(e)}>
                    Logout
                  </a>
                </NavbarDropdown>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

interface IDropdownProps {
  label: string
}

const NavbarDropdown: FunctionComponent<IDropdownProps> = ({
  label,
  children,
}) => (
  <div className='navbar-item has-dropdown is-hoverable'>
    <a className='navbar-link'>{label}</a>
    <div className='navbar-dropdown'>{children}</div>
  </div>
)

const mapStateToProps: MapStateToProps<IProps, {}, IState> = state => ({
  user: state.user.login,

  logout: logoutFn,
  push: pushFn,
})

const ConnectedNavbar = connect(
  mapStateToProps,
  {
    logout: logoutFn,
    push: pushFn,
  }
)(Navbar)

export default ConnectedNavbar
