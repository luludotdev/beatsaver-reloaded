import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router'
import { History } from 'history'
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore,
} from 'redux'
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

const composeEnhancers: typeof compose =
  process.env.NODE_ENV === 'production'
    ? compose
    : (composeWithDevTools as typeof compose)

export const createStore = (hist: History) =>
  createReduxStore(
    createRootReducer(hist),
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(hist)))
  )
