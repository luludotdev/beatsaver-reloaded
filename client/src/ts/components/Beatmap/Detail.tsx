import { AxiosError } from 'axios'
import chunk from 'chunk'
import React, {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Linkify from 'react-linkify'
import nl2br from 'react-nl2br'
import { Link } from 'react-router-dom'
import { NotFound } from '../../routes/NotFound'
import { axios } from '../../utils/axios'
import { ExtLink } from '../ExtLink'
import { Image } from '../Image'
import { Loader } from '../Loader'
import { TextPage } from '../TextPage'
import { DiffTags } from './DiffTags'
import { BeatmapStats } from './Statistics'

interface IProps {
  mapKey: string
}

export const BeatmapDetail: FunctionComponent<IProps> = ({ mapKey }) => {
  const [map, setMap] = useState(undefined as IBeatmap | undefined | Error)

  const [copied, setCopied] = useState(false)
  const bsrRef = useRef(null as HTMLInputElement | null)

  const copyBSR = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!bsrRef.current) return

    bsrRef.current.select()
    document.execCommand('copy')

    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  useEffect(() => {
    axios
      .get<IBeatmap>(`/maps/detail/${mapKey}`)
      .then(resp => {
        setMap(resp.data)
      })
      .catch(err => setMap(err))

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

  return (
    <>
      <div className='detail-artwork'>
        <Image
          src={map.coverURL}
          alt={`Artwork for ${map.name}`}
          draggable={false}
        />
      </div>

      <div className='detail-content'>
        <h1 className='is-size-1'>{map.name}</h1>
        <h2 className='is-size-4'>
          Uploaded by{' '}
          <Link to={`/uploader/${map.uploader._id}`}>
            {map.uploader.username}
          </Link>
        </h2>

        <div className='box'>
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
              {map.description ? (
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
              easy={map.metadata.difficulties.easy}
              normal={map.metadata.difficulties.normal}
              hard={map.metadata.difficulties.hard}
              expert={map.metadata.difficulties.expert}
              expertPlus={map.metadata.difficulties.expertPlus}
            />
          </div>

          <div className='right'>
            <BeatmapStats map={map} />
          </div>
        </div>

        <div className='buttons'>
          <a href={map.downloadURL}>Download</a>
          {/* <a href={`beatsaver://${map.key}`}>OneClick&trade; Install</a> */}
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
