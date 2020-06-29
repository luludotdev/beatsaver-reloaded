import JSZip from 'jszip'
import { IState } from '..'
import { AudioActionTypes } from './types'

type TypedThunk<P = any> = Thunk<AudioActionTypes, P>

export type PreviewBeatmap = ThunkFunction<typeof previewBeatmap>
export const previewBeatmap: (
  beatmap: IBeatmap
) => TypedThunk = beatmap => async (dispatch, getState) => {
  stopPreview()(dispatch, getState)

  dispatch({
    payload: true,
    type: AudioActionTypes.SET_LOADING,
  })

  dispatch({
    payload: beatmap.key,
    type: AudioActionTypes.SET_PLAYING_KEY,
  })

  try {
    const audioURL = await getAudioURL(beatmap, getState)
    dispatch({
      payload: { key: beatmap.key, value: audioURL },
      type: AudioActionTypes.ADD_AUDIO_URL,
    })

    dispatch({
      payload: false,
      type: AudioActionTypes.SET_LOADING,
    })

    dispatch({
      payload: audioURL,
      type: AudioActionTypes.SET_SOURCE,
    })

    dispatch({
      type: AudioActionTypes.PLAY,
    })

    dispatch({
      payload: null,
      type: AudioActionTypes.SET_ERROR,
    })
  } catch (err) {
    console.error(err)

    dispatch({
      payload: false,
      type: AudioActionTypes.SET_LOADING,
    })

    dispatch({
      payload: err,
      type: AudioActionTypes.SET_ERROR,
    })
  }
}

const getAudioURL: (
  beatmap: IBeatmap,
  getState: () => IState
) => Promise<string> = async (beatmap, getState) => {
  const { urls } = getState().audio
  const url = urls[beatmap.key]
  if (url) return url

  const resp = await fetch(beatmap.directDownload)
  const blob = await resp.blob()

  const zip = new JSZip()
  await zip.loadAsync(blob)

  const info = zip.file('Info.dat') || zip.file('info.dat')
  const infoJSON = JSON.parse(await info.async('text'))

  const songFilename: string = infoJSON._songFilename
  const audioFile = zip.file(songFilename)
  const audio = await audioFile.async('blob')
  return URL.createObjectURL(audio)
}

export type StopPreview = ThunkFunction<typeof stopPreview>
export const stopPreview: () => TypedThunk = () => dispatch => {
  dispatch({
    type: AudioActionTypes.STOP,
  })
}
