import { replace as replaceFn } from 'connected-react-router'
import { parse, stringify } from 'query-string'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { BeatmapList } from '../components/Beatmap'
import { IconInput } from '../components/Input'
import { IState } from '../store'

interface IProps {
  pathname: string
  queryStr: string

  replace: typeof replaceFn
}

const Search: FunctionComponent<IProps> = ({ pathname, queryStr, replace }) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const { q } = parse(queryStr)
    if (q !== query) {
      setQuery('')
      window.scroll({ top: 0 })
    }
  }, [queryStr])

  useEffect(() => {
    const { q } = parse(queryStr)
    if (q && typeof q === 'string') setQuery(q)
  }, [pathname])

  const search = (q: string) => {
    setQuery(q)

    if (!q) replace({ search: '' })
    else replace({ search: stringify({ q }) })
  }

  return (
    <>
      <div className='thin' style={{ marginBottom: '24px' }}>
        <IconInput
          value={query}
          onChange={v => search(v)}
          placeholder='Search BeatSaver'
          iconClass='fas fa-search'
        />
      </div>

      <BeatmapList type='text' query={query} />
    </>
  )
}

const mapStateToProps: MapStateToProps<IProps, {}, IState> = state => ({
  pathname: state.router.location.pathname,
  queryStr: state.router.location.search,

  replace: replaceFn,
})

const ConnectedSearch = connect(
  mapStateToProps,
  { replace: replaceFn }
)(Search)

export default ConnectedSearch
