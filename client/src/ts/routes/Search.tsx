import {replace as replaceFn} from 'connected-react-router'
import {parse, stringify} from 'query-string'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {connect, MapStateToProps} from 'react-redux'
import {BeatmapList} from '../components/Beatmap'
import {IconInput} from '../components/Input'
import {IState} from '../store'
import Select from 'react-select'
import {string} from "prop-types";

interface IProps {
  pathname: string
  queryStr: string

  replace: typeof replaceFn
}

const difficulties = [
  {value: 'easy', label: 'Easy'},
  {value: 'normal', label: 'Normal'},
  {value: 'hard', label: 'Hard'},
  {value: 'expert', label: 'Expert'},
  {value: 'expertPlus', label: 'ExpertPlus'},
];

const timeframes = [
  {value: 0, label: 'Past 24 hours'},
  {value: 1, label: 'Past week'},
  {value: 2, label: 'Past month'},
  {value: 3, label: 'Past year'},
  {value: 4, label: 'All time'},
];

const sortByValues = [
  {value: -1, label: 'Select...'},
  {value: 0, label: 'Downloads Asc'},
  {value: 1, label: 'Downloads Desc'},
  {value: 2, label: 'Rating Asc'},
  {value: 3, label: 'Rating Desc'},
  {value: 4, label: 'Plays Asc'},
  {value: 5, label: 'Plays Desc'},
];

const Search: FunctionComponent<IProps> = ({pathname, queryStr, replace}) => {

  const reactSelectStyle = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#3c3c3f' : ''
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: '#2d2d2f'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: '#171718',
      borderColor: '#2d2d2f',
      color: '#eff1f5'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#2d2d2f'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#eff1f5'
    }),
  }

  const [query, setQuery] = useState('*')
  const [difficulty, setDifficulty] = useState(difficulties.map(d => d.value));
  const [timeframe, setTimeframe] = useState(1);
  const [sortBy, setSortBy] = useState(1);

  useEffect(() => {
    const {q} = parse(queryStr)
    if (q !== query) {
      setQuery('*')
      window.scroll({top: 0})
    }
  }, [queryStr])

  useEffect(() => {

    let d = [];

    const {q, difficulty, timeframe, sortBy} = parse(queryStr)

    if (q && typeof q === 'string') setQuery(q)

    if (!Array.isArray(difficulty)) {
      d = difficulty ? [difficulty] : []
      setDifficulty(d)
    }

    if (timeframe && !isNaN(timeframe)) {
      setTimeframe(timeframe)
    }

    if (sortBy && !isNaN(sortBy)) {
      setSortBy(sortBy)
    }

  }, [pathname])

  const search = (q: string, difficulty: string[], timeframe: number, sortBy: number) => {

    if (!q) replace({search: ''})
    else replace({search: stringify({q, difficulty, timeframe, sortBy})})

    setQuery(q)
    setDifficulty(difficulty)
    setTimeframe(timeframe)
    setSortBy(sortBy)
  }

  return (
    <div>
      <div className='thin mb'>
        <IconInput
          value={query}
          onChange={v => search(v, difficulty, timeframe, sortBy)}
          placeholder='Search BeatSaver'
          iconClass='fas fa-search'
        />

      </div>

      {/*Filter by Difficulties*/}

      <div className='thin mb'>

        Difficulty

        <Select
          value={difficulties.filter(({value}) => difficulty.includes(value))}
          onChange={v => search(query, v ? v.map(d => d.value) : [], timeframe, sortBy)}
          options={difficulties}
          closeMenuOnSelect={false}
          isMulti={true}
          styles={reactSelectStyle}
        />

      </div>

      {/*Filter by Date*/}

      <div className='thin mb' style={{display: 'flex'}}>

        <div style={{flex: 1, marginRight: '24px'}}>
          Timeframe

          <Select
            value={timeframes.filter(({value}) => timeframe == value)}
            onChange={v => search(query, difficulty, v.value , sortBy)}
            options={timeframes}
            styles={reactSelectStyle}
          />
        </div>

        {/*Sort by - Downloads, Rating, Date, Plays,*/}

        <div style={{flex: 1}}>
          Sort By

          <Select
            value={sortByValues.filter(({value}) => sortBy == value)}
            onChange={v => search(query, difficulty, timeframe, v.value)}
            options={sortByValues}
            styles={reactSelectStyle}
          />
        </div>

      </div>

      <BeatmapList type='advanced'
                   query={query}
                   difficulty={difficulty}
                   timeframe={timeframe}
                   sortBy={sortBy}/>
    </div>
  )
}

const mapStateToProps: MapStateToProps<IProps, {}, IState> = state => ({
  pathname: state.router.location.pathname,
  queryStr: state.router.location.search,

  replace: replaceFn,
})

const ConnectedSearch = connect(
  mapStateToProps,
  {replace: replaceFn}
)(Search)

export {ConnectedSearch as Search}
