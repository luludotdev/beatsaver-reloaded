import stripHtmlString from 'string-strip-html'

export const stripHTML: (
  text: string | TemplateStringsArray,
  ...args: any[]
) => string = (text, ...args) => {
  const strip = (str: string) => {
    const replaced = str
      .replace(/<div>/g, '&#10;<div>')
      .replace(/<div><br><\/div>/g, '\u200b')

    const stripped = stripHtmlString(replaced)
    return stripped.replace(/\u200b/g, '')
  }

  if (typeof text === 'string') return strip(text)
  const built = text.reduce((acc, curr, i) => {
    const val = `${args[i] || ''}`
    return `${acc}${curr}${val}`
  }, '')

  return strip(built)
}

export const unstripHTML: (
  text: string | TemplateStringsArray,
  ...args: any[]
) => string = (text, ...args) => {
  const unstrip = (str: string) => {
    const lines = str.split('\n')
    return lines.reduce((acc, line, i) => {
      if (i === 0) return line

      if (line === '') acc += '<div><br></div>'
      else acc += `<div>${line}</div>`

      return acc
    }, '')
  }

  if (typeof text === 'string') return unstrip(text)
  const built = text.reduce((acc, curr, i) => {
    const val = `${args[i] || ''}`
    return `${acc}${curr}${val}`
  }, '')

  return unstrip(built)
}
