import { history } from '../init'

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
  parent.scrollBy(0, -17)
}

history.listen(() => setTimeout(() => checkHash(), 0))
