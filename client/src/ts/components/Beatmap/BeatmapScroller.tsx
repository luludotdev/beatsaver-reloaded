import React, { FunctionComponent } from 'react'
import { useInView } from 'react-intersection-observer'
import { IBeatmap } from '../../remote/beatmap'
import { APIError } from '../APIError'
import { Loader } from '../Loader'
import { BeatmapResult } from './BeatmapResult'

interface IProps {
  maps: IBeatmap[]
  loading: boolean
  done: boolean
  error: Error | null

  fallback?: JSX.Element
  next: () => any
}

const BeatmapScroller: FunctionComponent<IProps> = ({
  maps,
  loading,
  done,
  error,

  fallback,
  next,
}) => {
  const [ref, inView] = useInView({ rootMargin: '240px' })
  if (inView && !loading && !done) next()
  if (error) return <APIError error={error} />

  return (
    <>
      {maps.length === 0
        ? fallback || null
        : maps.map(m => <BeatmapResult key={m._id} {...m} />)}

      {!loading || done ? null : <Loader />}

      {!loading && !done && maps.length > 0 ? (
        <div ref={ref} style={{ height: '1px' }} />
      ) : null}
    </>
  )
}

export default BeatmapScroller
