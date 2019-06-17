import { readFileSync } from 'fs'
import { encode } from 'he'
import { join } from 'path'

export const root =
  process.env.NODE_ENV !== 'production'
    ? join(__dirname, '..', 'client')
    : join(__dirname, '..', 'public')

export const htmlPath = join(root, 'index.html')
export const html = readFileSync(htmlPath, 'utf8')

interface IOpenGraphOptions {
  siteName: string
  title: string
  url: string

  description?: string
  image?: string
}

export const generateOpenGraph = (options: IOpenGraphOptions) => {
  const lines = [
    `<meta property='og:type' content='website'>`,
    `<meta property='og:site_name' content='${encode(options.siteName)}'>`,
    `<meta property='og:title' content='${encode(options.title)}'>`,
    `<meta property='og:url' content='${options.url}'>`,
    options.description
      ? `<meta property='og:description' content='${encode(
          options.description
        )}'>`
      : undefined,
    options.image
      ? `<meta property='og:image' content='${options.image}'>`
      : undefined,
  ]

  return lines.filter(x => x !== undefined).join('')
}
