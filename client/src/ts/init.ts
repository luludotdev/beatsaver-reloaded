import { createBrowserHistory } from 'history'
import 'intersection-observer-polyfill'
import { createStore } from './store'
import { checkUser } from './store/user'
import { isFirefox } from './utils/dom'

import('./utils/fontAwesome').then()
import './utils/sessionStore'

if (isFirefox()) import('./utils/firefox').then()

export const history = createBrowserHistory()
export const store = createStore(history)

checkUser()(store.dispatch, store.getState)
