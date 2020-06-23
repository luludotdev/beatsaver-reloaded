import { replace } from 'connected-react-router'
import debounceFn from 'debounce-fn'
import { history, store } from '../init'

export const resetScroll = () => {
  const layout = document.getElementById('layout')
  const parent = layout && layout.parentElement
  if (!parent) return

  parent.scrollTo(0, 0)
}

export const checkHash = () => {
  const layout = document.getElementById('layout')
  const parent = layout && layout.parentElement
  if (!parent) return

  const {
    action,
    location: { hash },
  } = history

  if (action !== 'POP' || !hash) return

  const id = hash.replace('#', '')
  const elem = document.getElementById(id)
  if (!elem) return

  elem.scrollIntoView(true)
  parent.scrollBy(0, -100)
}

history.listen(() => setTimeout(() => checkHash(), 0))

const inView = (elem: Element) => {
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  )
}

const initScrollHandler = () => {
  const root = document.getElementById('root')
  if (!root) return

  root.onscroll = debounceFn(
    () => {
      const [visible] = [
        ...document.getElementsByClassName('beatmap-result'),
      ].filter(x => inView(x))

      const { search } = store.getState().router.location

      if (visible) store.dispatch(replace({ hash: visible.id, search }))
      else store.dispatch(replace({ hash: undefined, search }))
    },
    { wait: 50 }
  )
}

initScrollHandler()
