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
