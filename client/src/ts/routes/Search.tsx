import React, { FunctionComponent, useState } from 'react'
import { BeatmapList } from '../components/Beatmap'

const Search: FunctionComponent = () => {
  const [query, setQuery] = useState('')

  return (
    <>
      <input
        type='text'
        className='input'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <BeatmapList type='text' query={query} />
    </>
  )
}

export default Search
