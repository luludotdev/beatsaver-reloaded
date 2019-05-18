import React, { FunctionComponent, useState } from 'react'
import { BeatmapList } from '../components/Beatmap'

import '../../sass/search.scss'

const Search: FunctionComponent = () => {
  const [query, setQuery] = useState('')

  return (
    <>
      <div className='searchbox'>
        <div className='field'>
          <div className='control has-icons-left'>
            <input
              type='text'
              className='input'
              value={query}
              placeholder='Search BeatSaver'
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />

            <span className='icon is-small is-left'>
              <i className='fas fa-search' />
            </span>
          </div>
        </div>
      </div>

      <BeatmapList type='text' query={query} />
    </>
  )
}

export default Search
