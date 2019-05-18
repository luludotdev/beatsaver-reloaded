import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router'
import { createBrowserHistory, History } from 'history'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export interface IState {
  router: RouterState
}

const createRootReducer = (hist: History) =>
  combineReducers<IState>({
    router: connectRouter(hist),
  })

export const history = createBrowserHistory()
const rootReducer = createRootReducer(history)

declare const process: {
  env: {
    NODE_ENV: string
  }
}

const composeEnhancers: typeof compose =
  process.env.NODE_ENV === 'production'
    ? compose
    : (composeWithDevTools as typeof compose)

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(routerMiddleware(history)))
)
