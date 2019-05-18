import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './ts/App'
import { history, store } from './ts/store'

import './css/global.scss'

// @ts-ignore
import('./css/fontawesome.scss').then(() => {
  // Font Awesome Loaded!
})

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
