import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router'
import { createBrowserHistory, History } from 'history'
import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Dispatch,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import { IUserState, userReducer } from './user'

export type Thunk<T, P = any> = (
  dispatch: Dispatch<IAnyAction<T, P>>,
  getState: () => IState
) => void

export interface IAnyAction<T, P = any> extends Action<T> {
  payload?: P
}

export interface IState {
  router: RouterState
  user: IUserState
}

const createRootReducer = (hist: History) =>
  combineReducers<IState>({
    router: connectRouter(hist),
    user: userReducer,
  })

export const history = createBrowserHistory()
const rootReducer = createRootReducer(history)

const composeEnhancers: typeof compose =
  process.env.NODE_ENV === 'production'
    ? compose
    : (composeWithDevTools as typeof compose)

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))
)
