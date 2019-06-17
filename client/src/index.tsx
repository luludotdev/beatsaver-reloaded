import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { createBrowserHistory } from 'history'
import { App } from './ts/App'
import { createStore } from './ts/store'

import './sass/global.scss'
import './ts/init'

export const history = createBrowserHistory()
export const store = createStore(history)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
