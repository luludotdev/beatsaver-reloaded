import { FunctionComponent, useEffect, useState } from 'react'
import { createSearch, IBeatmap } from '../../remote/beatmap'

interface IRenderProps {
  maps: IBeatmap[]
  loading: boolean
  done: boolean

  next: () => any
}

interface ICommonProps {
  render: (props: IRenderProps) => JSX.Element
}

export type SearchType = 'latest' | 'downloads' | 'plays'
interface ISearchProps {
  type: SearchType
  query?: string
}

export type QueryType = 'text' | 'hash'
interface IQueryProps {
  type: QueryType
  query: string
}

export type IBeatmapSearch = ISearchProps | IQueryProps
type IProps = ICommonProps & IBeatmapSearch

const search = createSearch()
export const BeatmapAPI: FunctionComponent<IProps> = ({
  render,
  type,
  query,
}) => {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [maps, setMaps] = useState([] as IBeatmap[])

  useEffect(() => {
    setLoading(true)

    search
      .next({ type, query })
      .then(resp => {
        setLoading(false)
        setMaps(resp.value)
        setDone(resp.done)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [query])

  const next = async () => {
    setLoading(true)

    search
      .next({ type, query })
      .then(resp => {
        setLoading(false)
        setMaps([...maps, ...resp.value])
        setDone(resp.done)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  return render({ maps, loading, done, next })
}
