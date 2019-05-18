import uuid from 'uuid/v4'

/**
 * Asynchronously Blocks for n milliseconds
 * @param ms n milliseconds
 */
export const waitForMS = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

/**
 * Generate a safe pseudo-random token
 */
export const randomToken = () => uuid().replace(/-/g, '')
