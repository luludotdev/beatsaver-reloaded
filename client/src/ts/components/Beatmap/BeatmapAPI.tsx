import { FunctionComponent, useEffect } from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { IState } from '../../store'
import { IScroller } from '../../store/scrollers'
import {
  RequestNextMaps,
  requestNextMaps as requestNextMapsFn,
} from '../../store/scrollers'

interface IRenderProps {
  scroller: IScroller
  next: () => any
}

interface ICommonProps {
  render: (props: IRenderProps) => JSX.Element
}

interface IConnectedProps {
  scroller: IScroller
}

interface IFunctionProps {
  requestNextMaps: RequestNextMaps
}

type IPassedProps = ICommonProps & IBeatmapSearch
type IProps = IPassedProps & IConnectedProps & IFunctionProps

const BeatmapAPI: FunctionComponent<IProps> = ({
  render,
  scroller,
  requestNextMaps,
}) => {
  const request = () =>
    requestNextMaps(scroller.key, scroller.type, scroller.query)

  const next = () => {
    if (scroller.maps.length !== 0) request()
  }

  useEffect(() => {
    if (scroller.maps.length === 0) request()
  }, [scroller.key])

  return render({ scroller, next })
}

export type SearchType = 'latest' | 'hot' | 'downloads' | 'plays' | 'rating'
interface ISearchProps {
  type: SearchType
  query?: string
}

export type QueryType = 'text' | 'hash' | 'uploader'
interface IQueryProps {
  type: QueryType
  query: string
}

export type SearchTypes = SearchType | QueryType
export type IBeatmapSearch = ISearchProps | IQueryProps

const mapStateToProps: MapStateToProps<
  IConnectedProps,
  IPassedProps,
  IState
> = (state, { type, query }) => {
  const key = query !== undefined ? `${type}?q=${query}` : type

  const defaultScroller: IScroller = {
    key,
    query,
    type,

    done: false,
    error: undefined,
    lastPage: null,
    loading: false,
    maps: [],
  }

  return {
    scroller: state.scrollers[key] || defaultScroller,
  }
}

const dispatchProps: IFunctionProps = {
  requestNextMaps: requestNextMapsFn,
}

const ConnectedBeatmapAPI = connect(mapStateToProps, dispatchProps)(BeatmapAPI)
export { ConnectedBeatmapAPI as BeatmapAPI }
