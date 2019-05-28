import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './ts/App'
import { history, store } from './ts/store'

import './sass/global.scss'
import './ts/init'

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
