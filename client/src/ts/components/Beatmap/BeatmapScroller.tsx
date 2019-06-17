import React, { FunctionComponent } from 'react'
import Helmet from 'react-helmet'
import { useInView } from 'react-intersection-observer'
import { IScroller } from '../../store/scrollers'
import { APIError } from '../APIError'
import { Loader } from '../Loader'
import { BeatmapResult } from './BeatmapResult'

interface IProps {
  scroller: IScroller

  finite: boolean | undefined
  fallback?: JSX.Element
  next: () => any
}

export const BeatmapScroller: FunctionComponent<IProps> = ({
  scroller: { maps, loading, done, error, type },

  finite,
  fallback,
  next,
}) => {
  const [ref, inView] = useInView({ rootMargin: '240px' })
  if (inView && !loading && !done && !finite) next()
  if (error) return <APIError error={error} />

  const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const title =
    type === 'text'
      ? 'Search'
      : type === 'uploader'
      ? undefined
      : capitalize(type)

  return (
    <>
      {title === undefined ? null : (
        <Helmet>
          <title>BeatSaver - {title}</title>
        </Helmet>
      )}

      {maps.length === 0
        ? fallback || null
        : maps.map(m => <BeatmapResult key={m._id} map={m} />)}

      {!loading || done ? null : <Loader />}

      {!loading && !done && maps.length > 0 ? (
        <div ref={finite ? undefined : ref} style={{ height: '1px' }} />
      ) : null}

      {!finite ? null : (
        <button
          className='button is-fullwidth'
          style={{ maxWidth: '180px', margin: '0 auto' }}
          onClick={() => next()}
        >
          Show More...
        </button>
      )}
    </>
  )
}
