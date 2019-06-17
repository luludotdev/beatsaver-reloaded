import { Middleware } from 'koa'
import send from 'koa-send'
import mongoose from 'mongoose'
import { generateOpenGraph, html, htmlPath } from './generateHTML'

export const middleware: Middleware = async ctx => {
  ctx.set('cache-control', 'max-age=0')
  const notFound = () => send(ctx, htmlPath, { root: '/', maxAge: -1 })

  const key: string = ctx.params.key
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
    image: `${ctx.request.origin}/cdn/${map.key}/${map.hash}${map.coverExt}`,
    siteName: 'BeatSaver',
    title: map.name,
    url: `${ctx.request.origin}${ctx.originalUrl}`,
  })

  const page = html.replace('<head>', `<head>${metaTags}`)
  return (ctx.body = page)
}
