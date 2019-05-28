export const validJSON = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch (err) {
    return false
  }
}
