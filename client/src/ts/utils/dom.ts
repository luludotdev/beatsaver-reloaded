export const canUseDom = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )

export const isFirefox = () =>
  canUseDom() && navigator.userAgent.toLowerCase().includes('firefox')
