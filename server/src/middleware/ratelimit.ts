import { Context, Middleware } from 'koa'
import koaRateLimit, {
  HeaderNameOptions,
  MiddlewareOptions,
} from 'koa-ratelimit'
import { rateLimitDB } from '~redis'

interface IOptions {
  /**
   * The length of a single limiting period. This value is expressed
   * in milliseconds, defaulting to one hour.
   */
  duration?: number

  /**
   * The maximum amount of requests a client (see the `id` field) may
   * make during a limiting period. (see `duration`)
   */
  max?: number

  /**
   * Get the unique-identifier for a request. This defaults to the
   * client's IP address. Returning "false" will skip rate-limiting.
   */
  id?: (context: Context) => string | false

  /**
   * Whether or not to disable the usage of rate limit headers. This defaults
   * to **false**.
   */
  disableHeader?: boolean

  /**
   * The message used on the response body if a client is rate-limited. There is
   * a default message; which includes when they should try again.
   */
  errorMessage?: string

  /**
   * Whether or not to throw an error upon being rate-limited. This uses
   * the Koa context function "throw".
   */
  throw?: boolean

  /**
   * A relation of header to the header's display name.
   */
  headers?: HeaderNameOptions
}

export function rateLimit(opts: IOptions): Middleware
export function rateLimit(duration: number, max: number): Middleware
export function rateLimit(
  optsOrDur: number | IOptions,
  max?: number
): Middleware {
  const opts: Partial<IOptions> =
    typeof optsOrDur === 'number' ? { duration: optsOrDur, max } : optsOrDur

  const defaultOpts: Partial<IOptions> = {
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total',
    },
    id: ctx => `${ctx.url}:${ctx.realIP}`,
  }

  const db = rateLimitDB as any
  const options: MiddlewareOptions = { ...defaultOpts, ...opts, db }

  return koaRateLimit(options)
}
