const oldKeyRX = /^\d+-(\d+)$/
const newKeyRX = /^[0-9a-f]+$/

export const parseKey: (key: string, strict?: boolean) => string | false = (
  key,
  strict = false
) => {
  if (typeof key !== 'string') return false

  const isOld = key.match(oldKeyRX)
  if (isOld !== null) {
    if (strict) return false

    const oldKey = isOld[1]
    return parseInt(oldKey, 10).toString(16)
  }

  const isNew = key.match(newKeyRX)
  if (isNew === null) return false

  const k = key.toLowerCase()
  return k
}
