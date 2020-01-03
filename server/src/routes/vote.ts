import { ParameterizedContext } from 'koa'
import koaBody from 'koa-body'
import passport from 'koa-passport'
import Router from 'koa-router'
import { STEAM_API_KEY } from '~environment'
import { delCache, rateLimit } from '~middleware'
import { Beatmap, IUserModel } from '~mongo/models'
import axios from '~utils/axios'
import CodedError from '~utils/CodedError'
import { parseKey } from '~utils/parseKey'

const router = new Router({
  prefix: '/vote',
}).use(koaBody({ text: false, urlencoded: false }))

const ERR_INVALID_DIRECTION = new CodedError(
  'invalid vote direction',
  0x50001,
  'ERR_INVALID_DIRECTION',
  400
)

const ERR_INVALID_STEAM_ID = new CodedError(
  'invalid vote steam ID',
  0x50002,
  'ERR_INVALID_STEAM_ID',
  400
)

const ERR_INVALID_TICKET = new CodedError(
  'invalid vote ticket',
  0x50003,
  'ERR_INVALID_TICKET',
  400
)

const ERR_STEAM_API = new CodedError(
  'steam api error',
  0x50004,
  'ERR_STEAM_API'
)

const ERR_STEAM_ID_MISMATCH = new CodedError(
  'steam ID mismatch',
  0x50005,
  'ERR_STEAM_ID_MISMATCH',
  401
)

const ERR_BAD_TICKET = new CodedError(
  'bad ticket',
  0x50006,
  'ERR_BAD_TICKET',
  401
)

const voteRL = rateLimit({
  duration: 1 * 1000,
  id: ctx => `/vote/${parseKey(ctx.params.key)}:${ctx.realIP}`,
  max: 1,
})

router.post(
  '/user/:key',
  voteRL,
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const user: IUserModel = ctx.state.user
    const voterUID = `${user._id}`

    return submitVote(ctx, voterUID)
  }
)

interface ISteamSuccess {
  error: undefined
  params: {
    result: 'OK'
    steamid: string
    ownersteamid: string
    vacbanned: boolean
    publisherbanned: boolean
  }
}

interface ISteamError {
  params: undefined
  error: {
    errorcode: number
    errordesc: string
  }
}

router.post('/steam/:key', voteRL, async ctx => {
  const { steamID, ticket } = ctx.request.body

  if (!steamID) throw ERR_INVALID_STEAM_ID
  if (!ticket) throw ERR_INVALID_TICKET

  const url =
    `https://api.steampowered.com/ISteamUserAuth/` +
    `AuthenticateUserTicket/v1?key=${STEAM_API_KEY}&appid=620980&ticket=${ticket}`

  try {
    interface ISteamResp {
      response: ISteamSuccess | ISteamError
    }

    const {
      data: { response: resp },
    } = await axios.get<ISteamResp>(url)

    if (resp.params && resp.params.steamid === steamID) {
      // Valid
      return submitVote(ctx, steamID)
    } else if (resp.params && resp.params.steamid !== steamID) {
      // Valid, mismatching Steam ID
      throw ERR_STEAM_ID_MISMATCH
    } else {
      // Invalid ticket
      throw ERR_BAD_TICKET
    }
  } catch (err) {
    if (err.response !== undefined) throw ERR_STEAM_API
    else throw err
  }
})

const submitVote = async (ctx: ParameterizedContext, voterUID: string) => {
  const { direction: d } = ctx.request.body
  const direction: number = parseInt(d, 10)
  if (direction !== -1 && direction !== 1) throw ERR_INVALID_DIRECTION

  const key = parseKey(ctx.params.key)
  if (key === false) return (ctx.status = 404)

  const map = await Beatmap.findOne({ key, deletedAt: null })
  if (!map) return (ctx.status = 404)

  const existingVote = map.votes.find(x => x.voterUID === voterUID)
  if (existingVote) {
    existingVote.direction = direction
  } else {
    map.votes.push({ voterUID, direction })
  }

  await Promise.all([
    map.save(),
    delCache(`stats:key:${map.key}`),
    delCache(`stats:hash:${map.hash}`),
  ])

  await map.populate('uploader').execPopulate()
  return (ctx.body = map)
}

export { router as voteRouter }
