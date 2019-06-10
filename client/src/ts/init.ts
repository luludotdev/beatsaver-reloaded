import { store } from './store'
import { checkUser } from './store/user'

import('./utils/fontAwesome').then()

checkUser()(store.dispatch, store.getState)
