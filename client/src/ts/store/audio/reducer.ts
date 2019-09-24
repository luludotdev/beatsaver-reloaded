import { Reducer } from 'redux'
import { AudioActionTypes, IAudioState } from './types'

const initialState: IAudioState = {
  source: undefined,
  state: 'stopped',
  volume: 0.5,

  error: null,
  key: null,
  loading: false,

  urls: {},
}

const audio = new Audio()
audio.volume = initialState.volume

export const audioReducer: Reducer<
  IAudioState,
  IAnyAction<AudioActionTypes>
> = (state = initialState, action) => {
  if (action.type === AudioActionTypes.PLAY) {
    audio.play()
    return { ...state, state: 'playing' }
  } else if (action.type === AudioActionTypes.PAUSE) {
    audio.pause()
    return { ...state, state: 'paused' }
  } else if (action.type === AudioActionTypes.STOP) {
    audio.pause()
    audio.currentTime = 0

    return { ...state, state: 'stopped', key: null, source: undefined }
  } else if (action.type === AudioActionTypes.SET_VOLUME) {
    audio.volume = action.payload
    return { ...state, volume: action.payload }
  } else if (action.type === AudioActionTypes.SET_SOURCE) {
    audio.src = action.payload
    return { ...state, source: action.payload }
  } else if (action.type === AudioActionTypes.SET_LOADING) {
    return { ...state, loading: action.payload }
  } else if (action.type === AudioActionTypes.SET_ERROR) {
    return { ...state, error: action.payload }
  } else if (action.type === AudioActionTypes.SET_PLAYING_KEY) {
    return { ...state, key: action.payload }
  } else if (action.type === AudioActionTypes.ADD_AUDIO_URL) {
    return {
      ...state,
      urls: { ...action.payload, [action.payload.key]: action.payload.value },
    }
  } else {
    return state
  }
}
