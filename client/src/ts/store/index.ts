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

import { audioReducer, IAudioState } from './audio'
import { IImagesState, imagesReducer } from './images'
import { IPrefsState, prefsReducer } from './prefs'
import { IScrollersState, scrollersReducer } from './scrollers'
import { IUserState, userReducer } from './user'

export interface IState {
  audio: IAudioState
  images: IImagesState
  prefs: IPrefsState
  router: RouterState
  scrollers: IScrollersState
  user: IUserState
}

const createRootReducer = (hist: History) =>
  combineReducers<IState>({
    audio: audioReducer,
    images: imagesReducer,
    prefs: prefsReducer,
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
