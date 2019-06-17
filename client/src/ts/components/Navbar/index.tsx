import { push as pushFn } from 'connected-react-router'
import React, { FunctionComponent, MouseEvent, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { IState } from '../../store'
import { IUser, Logout, logout as logoutFn } from '../../store/user'
import { NavbarDivider } from './NavbarDivider'
import { NavbarDropdown, NavbarDropdownDivider } from './NavbarDropdown'
import { NavbarClickableItem, NavbarItem, NavbarItemExt } from './NavbarItem'

import Logo from '../../../images/beat_saver_logo_white.png'

interface IProps {
  user: IUser | null | undefined

  logout: Logout
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
          <NavbarItem setActive={setActive} to='/'>
            <img src={Logo} alt='BeatSaver' />
          </NavbarItem>

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
            <NavbarItem setActive={setActive} to='/browse/hot'>
              Hot
            </NavbarItem>

            <NavbarDropdown label='Sort By'>
              <NavbarItem setActive={setActive} to='/browse/rating'>
                Rating
              </NavbarItem>

              <NavbarItem setActive={setActive} to='/browse/latest'>
                Latest
              </NavbarItem>

              <NavbarItem setActive={setActive} to='/browse/downloads'>
                Downloads
              </NavbarItem>

              <NavbarItem setActive={setActive} to='/browse/plays'>
                Plays
              </NavbarItem>
            </NavbarDropdown>

            <NavbarItem setActive={setActive} to='/search'>
              Search
            </NavbarItem>
            <NavbarDivider />

            <NavbarItemExt href='https://bsaber.com'>BeastSaber</NavbarItemExt>

            <NavbarItemExt href='https://scoresaber.com'>
              ScoreSaber
            </NavbarItemExt>

            <NavbarDropdown label='Modding'>
              <NavbarItemExt href='https://bsmg.wiki/beginners-guide'>
                Modding Guide
              </NavbarItemExt>

              <NavbarItemExt href='https://discord.gg/beatsabermods'>
                Modding Discord
              </NavbarItemExt>

              <NavbarItemExt href='https://bsmg.wiki/'>
                Community Wiki
              </NavbarItemExt>
            </NavbarDropdown>
          </div>

          <div className='navbar-end'>
            {!user ? (
              <NavbarItem setActive={setActive} to='/auth/login'>
                Login
              </NavbarItem>
            ) : (
              <>
                <NavbarItem setActive={setActive} to='/user/upload'>
                  Upload
                </NavbarItem>

                <NavbarDropdown label={user.username}>
                  <NavbarItem
                    setActive={setActive}
                    to={`/uploader/${user._id}`}
                  >
                    My Beatmaps
                  </NavbarItem>

                  <NavbarDropdownDivider />

                  <NavbarClickableItem onClick={e => handleLogout(e)}>
                    Logout
                  </NavbarClickableItem>
                </NavbarDropdown>
              </>
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
