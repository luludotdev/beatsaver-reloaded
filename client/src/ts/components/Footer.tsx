import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { ExtLink } from './ExtLink'

export const Footer: FunctionComponent = () => (
  <footer className='sticky-footer'>
    <div className='content'>
      <ul className='spaced'>
        <li>
          <Link to='/legal/dmca'>DMCA</Link>
        </li>
        <li>
          <Link to='/legal/privacy'>Privacy</Link>
        </li>
        <li>
          <ExtLink href='https://github.com/lolPants/beatsaver-reloaded'>
            GitHub
          </ExtLink>
        </li>
        <li>
          <Link to='/legal/license'>License</Link>
        </li>
      </ul>
    </div>
  </footer>
)
