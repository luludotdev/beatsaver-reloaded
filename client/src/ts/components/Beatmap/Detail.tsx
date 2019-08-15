import { AxiosError } from 'axios'
import chunk from 'chunk'
import { Push, push as pushFn } from 'connected-react-router'
import React, {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Helmet from 'react-helmet'
import Linkify from 'react-linkify'
import nl2br from 'react-nl2br'
import { connect, MapStateToProps } from 'react-redux'
import { Link } from 'react-router-dom'
import { NotFound } from '../../routes/NotFound'
import { IState } from '../../store'
import {
  IAudioState,
  PreviewBeatmap,
  previewBeatmap as previewBeatmapFn,
  StopPreview,
  stopPreview as stopPreviewFn,
} from '../../store/audio'
import { IUser } from '../../store/user'
import { axios } from '../../utils/axios'
import { parseCharacteristics } from '../../utils/characteristics'
import swal from '../../utils/swal'
import { ExtLink } from '../ExtLink'
import { Image } from '../Image'
import { Loader } from '../Loader'
import { TextPage } from '../TextPage'
import { DiffTags } from './DiffTags'
import { BeatmapStats } from './Statistics'

interface IConnectedProps {
  user: IUser | null | undefined
  preview: IAudioState
}

interface IDispatchProps {
  push: Push
  previewBeatmap: PreviewBeatmap
  stopPreview: StopPreview
}

interface IPassedProps {
  mapKey: string
}

type IProps = IConnectedProps & IDispatchProps & IPassedProps

const BeatmapDetail: FunctionComponent<IProps> = ({
  user,
  push,
  mapKey,
  preview,
  previewBeatmap,
  stopPreview,
}) => {
  const [map, setMap] = useState<IBeatmap | undefined | Error>(undefined)

  const [editing, setEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    if (!editing) {
      const sel = document.getSelection()
      if (sel) sel.removeAllRanges()

      return
    }

    const { current } = descriptionRef
    if (current === null) return

    current.focus()
    document.execCommand('selectAll', false, undefined)
  }, [editing])

  const [copied, setCopied] = useState<boolean>(false)
  const bsrRef = useRef<HTMLInputElement | null>(null)

  const copyBSR = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!bsrRef.current) return

    bsrRef.current.select()
    document.execCommand('copy')

    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const loadMap = (callback?: () => any) =>
    axios
      .get<IBeatmap>(`/maps/detail/${mapKey}`)
      .then(resp => {
        setMap(resp.data)
        setName(resp.data.name)
        setDescription(resp.data.description)

        if (callback) callback()
      })
      .catch(err => setMap(err))

  useEffect(() => {
    loadMap()

    return () => {
      setMap(undefined)
    }
  }, [mapKey])

  if (map === undefined) return <Loader />
  if (map instanceof Error) {
    const error = map as AxiosError
    if (error.response && error.response.status === 404) {
      return <NotFound />
    }

    return (
      <TextPage title='Network Error'>
        <p>Failed to load beatmap info! Please try again later.</p>
        <p>If the problem persists, please alert a site admin.</p>
      </TextPage>
    )
  }

  const isUploader = user && user._id === map.uploader._id

  const deleteMap = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!isUploader) return

    const result = await swal.fire({
      confirmButtonColor: '#bf2a42',
      reverseButtons: true,
      showCancelButton: true,
      text: 'Are you sure? This cannot be undone!',
      title: 'Delete Beatmap',
      type: 'warning',
    })

    if (!result.value) return
    try {
      await axios.post(`/manage/delete/${map.key}`)
      return push('/')
    } catch (err) {
      swal.fire({
        title: 'Delete Failed',
        type: 'error',
      })

      console.error(err)
    }
  }

  const editMap = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setEditing(true)
  }

  const stopEditing = async (
    e: MouseEvent<HTMLAnchorElement>,
    save: boolean = false
  ) => {
    e.preventDefault()
    if (!save) return loadMap(() => setEditing(false))

    try {
      await axios.post(`/manage/edit/${map.key}`, { name, description })
      loadMap(() => setEditing(false))
    } catch (err) {
      const { response } = err as AxiosError<IRespError>
      const genericError = () => {
        swal.fire({
          title: 'Edit Failed',
          type: 'error',
        })

        return console.error(err)
      }

      if (response === undefined) return genericError()
      const resp = response.data

      if (
        resp.identifier === 'ERR_INVALID_FIELDS' &&
        resp.fields !== undefined
      ) {
        if (resp.fields.some(x => x.path === 'name')) {
          swal.fire({
            text: 'Beatmap title is invalid!',
            title: 'Edit Failed',
            type: 'error',
          })
        }

        return
      }

      return genericError()
    }
  }

  return (
    <>
      <Helmet>
        <title>BeatSaver - {map.name}</title>
      </Helmet>

      <div className='detail-artwork'>
        <Image
          src={map.coverURL}
          alt={`Artwork for ${map.name}`}
          draggable={false}
        />
      </div>

      <div className='detail-content'>
        <h1 className='is-size-1'>
          {editing ? (
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          ) : (
            map.name
          )}
        </h1>

        <h2 className='is-size-4'>
          Uploaded by{' '}
          <Link to={`/uploader/${map.uploader._id}`}>
            {map.uploader.username}
          </Link>
        </h2>

        {!isUploader ? null : (
          <div className='buttons top'>
            {/* <a href='#'>📤 Upload new version</a> */}

            {editing ? (
              <>
                <a href='/' onClick={e => stopEditing(e, true)}>
                  💾 Save
                </a>

                <a href='/' onClick={e => stopEditing(e, false)}>
                  🔥 Discard
                </a>
              </>
            ) : (
              <>
                <a href='/' onClick={e => editMap(e)}>
                  📝 Edit
                </a>

                <a href='/' onClick={e => deleteMap(e)}>
                  ❌ Delete
                </a>
              </>
            )}
          </div>
        )}

        <div
          className={`box has-buttons-bottom ${
            isUploader ? 'has-buttons-top' : ''
          }`}
        >
          <div className='left'>
            <div className='metadata'>
              <Metadata
                metadata={[
                  ['Song Name', map.metadata.songName],
                  ['Song Sub Name', map.metadata.songSubName],
                  ['Song Author Name', map.metadata.songAuthorName],
                  ['Level Author Name', map.metadata.levelAuthorName],
                ]}
              />
            </div>

            <div className='description'>
              {editing ? (
                <textarea
                  ref={descriptionRef}
                  rows={description.split('\n').length}
                  onChange={e => setDescription(e.target.value)}
                >
                  {description}
                </textarea>
              ) : map.description ? (
                <Linkify
                  componentDecorator={(href, text, key) => (
                    <ExtLink key={`${href}:${text}:${key}`} href={href}>
                      {text}
                    </ExtLink>
                  )}
                >
                  {nl2br(map.description)}
                </Linkify>
              ) : (
                <i>No description given.</i>
              )}
            </div>

            <DiffTags
              style={{ marginBottom: 0, marginTop: '10px' }}
              easy={map.metadata.difficulties.easy}
              normal={map.metadata.difficulties.normal}
              hard={map.metadata.difficulties.hard}
              expert={map.metadata.difficulties.expert}
              expertPlus={map.metadata.difficulties.expertPlus}
            />

            <div className='tags' style={{ marginBottom: '-10px' }}>
              {parseCharacteristics(map.metadata.characteristics).map(
                ({ name: n }, i) => (
                  <span key={`${n}:${i}`} className='tag is-dark'>
                    {n}
                  </span>
                )
              )}
            </div>
          </div>

          <div className='right'>
            <BeatmapStats map={map} />
          </div>
        </div>

        <div className='buttons'>
          <a href={map.downloadURL}>Download</a>
          <a href={`beatsaver://${map.key}`}>OneClick&trade; Install</a>
          <a
            href='/'
            className={
              !preview.loading
                ? undefined
                : preview.key === map.key
                ? 'loading disabled'
                : 'loading'
            }
            onClick={e => {
              e.preventDefault()

              if (preview.state === 'playing' && preview.key === map.key) {
                stopPreview()
              } else {
                previewBeatmap(map)
              }
            }}
          >
            {preview.loading
              ? '.'
              : preview.key !== map.key
              ? 'Preview'
              : preview.error !== null
              ? 'Playback error!'
              : 'Stop Preview'}
          </a>
          {/* <a href='/'>View on BeastSaber</a> */}
          <a href='/' onClick={e => copyBSR(e)}>
            {copied ? (
              'Copied!'
            ) : (
              <>
                <p>
                  Copy{' '}
                  <span className='mono' style={{ fontSize: '0.9em' }}>
                    !bsr
                  </span>
                </p>

                <input
                  ref={bsrRef}
                  readOnly={true}
                  type='text'
                  value={`!bsr ${map.key}`}
                  style={{ position: 'absolute', top: 0, left: -100000 }}
                />
              </>
            )}
          </a>
          {/* <a href='/'>Preview</a> */}
        </div>
      </div>
    </>
  )
}

const mapStateToProps: MapStateToProps<
  IConnectedProps,
  IPassedProps,
  IState
> = state => ({
  preview: state.audio,
  user: state.user.login,
})

const mapDispatchToProps: IDispatchProps = {
  previewBeatmap: previewBeatmapFn,
  push: pushFn,
  stopPreview: stopPreviewFn,
}

const ConnectedBeatmapDetail = connect(
  mapStateToProps,
  mapDispatchToProps
)(BeatmapDetail)
export { ConnectedBeatmapDetail as BeatmapDetail }

interface IMetadataProps {
  metadata: ReadonlyArray<readonly [string, any]>
}

export const Metadata: FunctionComponent<IMetadataProps> = ({ metadata }) => {
  const chunks = chunk(metadata, 2)

  return (
    <>
      {chunks.map((x, i) => (
        <div key={i} className='col'>
          <table>
            <tbody>
              {x.map(([k, v], j) => (
                <tr key={j}>
                  <td>{k}</td>
                  <td className={v ? undefined : 'hidden'}>{v || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}
