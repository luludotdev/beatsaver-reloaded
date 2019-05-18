/**
 * Returns a date n days ahead of today
 * @param days Days to add
 */
export const plusDays = (days: number) =>
  new Date(new Date().setDate(new Date().getDate() + days))

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
