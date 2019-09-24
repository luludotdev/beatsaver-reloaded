export enum AudioActionTypes {
  PLAY = '@@audio/PLAY',
  PAUSE = '@@audio/PAUSE',
  STOP = '@@audio/STOP',

  SET_VOLUME = '@@audio/SET_VOLUME',
  SET_SOURCE = '@@audio/SET_SOURCE',
  SET_LOADING = '@@audio/SET_LOADING',
  SET_ERROR = '@@audio/SET_ERROR',
  SET_PLAYING_KEY = '@@audio/SET_PLAYING_KEY',

  ADD_AUDIO_URL = '@@audio/ADD_AUDIO_URL',
}

export type AudioState = 'playing' | 'paused' | 'stopped'

export interface IAudioState {
  state: AudioState
  source: string | undefined
  volume: number

  loading: boolean
  error: Error | null
  key: string | null

  urls: {
    [key: string]: string
  }
}
