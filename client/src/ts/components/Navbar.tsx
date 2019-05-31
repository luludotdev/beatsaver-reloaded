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
}

const Navbar: FunctionComponent<IProps> = ({ user, logout }) => {
  const [active, setActive] = useState(false)

  const toggle = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setActive(!active)
  }

  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
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

            <div className='navbar-item has-dropdown is-hoverable'>
              <a className='navbar-link'>Sort By</a>

              <div className='navbar-dropdown'>
                <Link className='navbar-item' to='/browse/downloads'>
                  Downloads
                </Link>

                <Link className='navbar-item' to='/browse/plays'>
                  Plays
                </Link>

                <Link className='navbar-item' to='/browse/rating'>
                  Rating
                </Link>
              </div>
            </div>

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

            <div className='navbar-item has-dropdown is-hoverable'>
              <a className='navbar-link'>Modding</a>

              <div className='navbar-dropdown'>
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
              </div>
            </div>
          </div>

          <div className='navbar-end'>
            {!user ? (
              <Link className='navbar-item' to='/auth/login'>
                Login
              </Link>
            ) : (
              <a className='navbar-item' onClick={e => handleLogout(e)}>
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps: MapStateToProps<IProps, {}, IState> = state => ({
  user: state.user.login,

  logout: logoutFn,
})

const ConnectedNavbar = connect(
  mapStateToProps,
  {
    logout: logoutFn,
  }
)(Navbar)

export default ConnectedNavbar
