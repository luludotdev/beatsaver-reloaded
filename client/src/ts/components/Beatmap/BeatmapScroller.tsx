import React, { FunctionComponent, useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { useInView } from 'react-intersection-observer'
import { history } from '../../init'
import { IScroller } from '../../store/scrollers'
import { checkHash } from '../../utils/scroll'
import { capitalize } from '../../utils/strings'
import { APIError } from '../APIError'
import { Loader } from '../Loader'
import { BeatmapResult } from './BeatmapResult'

interface IProps {
  scroller: IScroller
  showAutos?: boolean

  finite: boolean | undefined
  fallback?: JSX.Element
  next: () => any
}

export const BeatmapScroller: FunctionComponent<IProps> = ({
  showAutos,
  scroller: { maps, loading, done, error, type },

  finite,
  fallback,
  next,
}) => {
  const [ref, inView] = useInView({ rootMargin: '240px' })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (maps.length === 0) return
    if (scrolled) return
    if (history.action !== 'POP') return

    setScrolled(true)
    checkHash()
  }, [maps.length])

  if (inView && !loading && !done && !finite) next()
  if (error) return <APIError error={error} />

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
        : maps
            .filter(m => (showAutos ? true : m.metadata.automapper === null))
            .map(m => <BeatmapResult key={m._id} map={m} />)}

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
