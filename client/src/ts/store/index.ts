import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router'
import { createBrowserHistory, History } from 'history'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import { IImagesState, imagesReducer } from './images'
import { IScrollersState, scrollersReducer } from './scrollers'
import { IUserState, userReducer } from './user'

export interface IState {
  images: IImagesState
  router: RouterState
  scrollers: IScrollersState
  user: IUserState
}

const createRootReducer = (hist: History) =>
  combineReducers<IState>({
    images: imagesReducer,
    router: connectRouter(hist),
    scrollers: scrollersReducer,
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
