import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './ts/App'

import './sass/global.scss'
import { history, store } from './ts/init'

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
