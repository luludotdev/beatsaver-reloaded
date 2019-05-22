import { store } from './store'
import { checkUser } from './store/user'

checkUser()(store.dispatch, store.getState)
