import { createBrowserHistory } from 'history'
import { createStore } from './store'
import { checkUser } from './store/user'
import('./utils/fontAwesome').then()

export const history = createBrowserHistory()
export const store = createStore(history)

checkUser()(store.dispatch, store.getState)
