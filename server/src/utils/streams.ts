import { Transform } from 'stream'

export const jsonStream = () => {
  let first = true

  return new Transform({
    flush: cb => cb(null, ']\n'),
    objectMode: true,
    transform: (chunk, _, cb) => {
      if (first) {
        first = false
        return cb(null, `[${JSON.stringify(chunk)}`)
      } else {
        return cb(null, `,${JSON.stringify(chunk)}`)
      }
    },
  })
}
