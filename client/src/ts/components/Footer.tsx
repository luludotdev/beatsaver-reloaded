import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { ExtLink } from './ExtLink'

import '../../sass/footer.scss'

export const Footer: FunctionComponent = () => (
  <footer className='footer'>
    <div className='content has-text-centered'>
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
      </ul>
    </div>
  </footer>
)
