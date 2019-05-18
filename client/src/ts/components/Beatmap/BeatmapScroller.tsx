import React, { FunctionComponent } from 'react'
import { useInView } from 'react-intersection-observer'
import { IBeatmap } from '../../remote/beatmap'
import { Loader } from '../Loader'
import { BeatmapResult } from './BeatmapResult'

interface IProps {
  maps: IBeatmap[]
  loading: boolean
  done: boolean

  fallback?: JSX.Element
  next: () => any
}

const BeatmapScroller: FunctionComponent<IProps> = ({
  maps,
  loading,
  done,

  fallback,
  next,
}) => {
  const [ref, inView] = useInView()
  if (inView && !loading && !done) next()

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
