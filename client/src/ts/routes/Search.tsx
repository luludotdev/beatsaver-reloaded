import { push as pushFn } from 'connected-react-router'
import { parse, stringify } from 'query-string'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { BeatmapList } from '../components/Beatmap'
import { Input } from '../components/Input'
import { IState } from '../store'

interface IProps {
  push: typeof pushFn
  queryStr: string
}

const Search: FunctionComponent<IProps> = ({ push, queryStr }) => {
  const [query, setQuery] = useState('')
  useEffect(() => {
    const { q } = parse(queryStr)
    if (q && typeof q === 'string') setQuery(q)
  }, [])

  const search = (q: string) => {
    setQuery(q)

    if (!q) push({ search: '' })
    else push({ search: stringify({ q }) })
  }

  return (
    <>
      <div className='thin' style={{ marginBottom: '24px' }}>
        <Input
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
  push: pushFn,
  queryStr: state.router.location.search,
})

const ConnectedSearch = connect(
  mapStateToProps,
  { push: pushFn }
)(Search)

export default ConnectedSearch
