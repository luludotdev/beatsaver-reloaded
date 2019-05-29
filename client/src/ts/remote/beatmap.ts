import pDebounce from 'p-debounce'
import { QueryType, SearchType } from '../components/Beatmap/BeatmapAPI'
import { axios } from '../utils/axios'
import { IResponse } from './response'

export interface IBeatmap {
  _id: string
  key: string
  name: string
  description: string

  uploader: {
    _id: string
    username: string
  }

  uploaded: Date | string

  metadata: {
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string

    bpm: number

    difficulties: {
      easy: boolean
      normal: boolean
      hard: boolean
      expert: boolean
      expertPlus: boolean
    }

    characteristics: string[]
  }

  stats: {
    downloads: number
    plays: number

    upVotes: number
    downVotes: number
    rating: number
  }

  downloadURL: string
  coverURL: string

  hash: string
}

export type IBeatmapResponse = IResponse<IBeatmap>

interface ISearchResult {
  value: IBeatmap[]
  done: boolean
}

export const createSearch = () => {
  let nextPage: number | null = 0

  let lastType: string | undefined
  let lastQuery: string | undefined

  interface ISearchOptions {
    type: SearchType | QueryType
    query?: string

    reset?: boolean
  }

  const fetch: (options: ISearchOptions) => Promise<ISearchResult> = async ({
    type,
    query,
    reset,
  }) => {
    if (reset || type !== lastType || query !== lastQuery) nextPage = 0
    if (nextPage === null) {
      return {
        done: true,
        value: [],
      }
    }

    const isSearch = type === 'text' || type === 'hash'
    if (isSearch && !query) {
      return {
        done: true,
        value: [],
      }
    }

    const url = isSearch
      ? `/search/${type}/${nextPage}?q=${encodeURIComponent(query || '')}`
      : `/maps/${type}/${nextPage}`

    const resp = await axios.get<IBeatmapResponse>(url)
    nextPage = resp.data.nextPage

    lastType = type
    lastQuery = query

    return {
      done: resp.data.nextPage === null,
      value: resp.data.docs,
    }
  }

  const dFetch = pDebounce(fetch, 200)

  return {
    next: dFetch,
  }
}
