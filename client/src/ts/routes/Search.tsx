import React, { FunctionComponent, useState } from 'react'
import { BeatmapList } from '../components/Beatmap'
import { Input } from '../components/Input'

import '../../sass/search.scss'

const Search: FunctionComponent = () => {
  const [query, setQuery] = useState('')

  return (
    <>
      <div className='searchbox thin'>
        <Input
          value={query}
          onChange={v => setQuery(v)}
          placeholder='Search BeatSaver'
          iconClass='fas fa-search'
        />
      </div>

      <BeatmapList type='text' query={query} />
    </>
  )
}

export default Search
