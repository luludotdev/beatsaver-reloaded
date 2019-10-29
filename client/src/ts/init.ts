import { createBrowserHistory } from 'history'
import 'intersection-observer-polyfill'
import { createStore } from './store'
import { checkUser } from './store/user'

import('./utils/fontAwesome').then()
import './utils/sessionStore'

export const history = createBrowserHistory()
export const store = createStore(history)

checkUser()(store.dispatch, store.getState)
