import React, { FunctionComponent } from 'react'
import { useInView } from 'react-intersection-observer'
import { APIError } from '../APIError'
import { Loader } from '../Loader'
import { BeatmapResult } from './BeatmapResult'

interface IProps {
  maps: IBeatmap[]
  loading: boolean
  done: boolean
  error: Error | undefined
  finite: boolean | undefined

  fallback?: JSX.Element
  next: () => any
}

export const BeatmapScroller: FunctionComponent<IProps> = ({
  maps,
  loading,
  done,
  error,
  finite,

  fallback,
  next,
}) => {
  const [ref, inView] = useInView({ rootMargin: '240px' })
  if (inView && !loading && !done && !finite) next()
  if (error) return <APIError error={error} />

  return (
    <>
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
