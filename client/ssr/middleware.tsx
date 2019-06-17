import { Middleware } from 'koa'
import send from 'koa-send'
import mongoose from 'mongoose'
import { generateOpenGraph, html, htmlPath } from './generateHTML'

const oldKeyRX = /^\d+-(\d+)$/
const newKeyRX = /^[0-9a-f]+$/

export const parseKey: (key: string) => string | false = key => {
  if (typeof key !== 'string') return false

  const isOld = key.match(oldKeyRX)
  if (isOld !== null) {
    const oldKey = isOld[1]
    return parseInt(oldKey, 10).toString(16)
  }

  const isNew = key.match(newKeyRX)
  if (isNew === null) return false

  const k = key.toLowerCase()
  return k
}

export const middleware: Middleware = async ctx => {
  ctx.set('cache-control', 'max-age=0')
  const notFound = () => send(ctx, htmlPath, { root: '/', maxAge: -1 })

  const key = parseKey(ctx.params.key)
  if (!key) return notFound()

  const numKey = await parseInt(key, 16)
  const beatmaps = await mongoose.connection.db.collection('beatmaps')
  const [map] = await (await beatmaps.find(
    { key: numKey },
    { projection: { votes: 0 } }
  )).toArray()

  if (!map) return notFound()
  const metaTags = generateOpenGraph({
    description: map.description,
    image: `${ctx.request.origin}/cdn/${key}/${map.hash}${map.coverExt}`,
    siteName: 'BeatSaver',
    title: map.name,
    url: `${ctx.request.origin}${ctx.originalUrl}`,
  })

  const page = html.replace('<head>', `<head>${metaTags}`)
  return (ctx.body = page)
}
