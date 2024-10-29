import type { Client } from '../../../Internal/Client/types.js'
import type { GlobalErrorType } from '../../../Internal/Errors/error.js'
import { Actions_UserData_getUserDataUsername } from '../Actions/UserData/getUserDataUsername.js'
import { Embed_fromMessage } from '../Embed/fromMessage.js'
import type { Embed } from '../Embed/types.js'
import { Meta_fromMessage } from '../Meta/fromMessage.js'
import { Parent_fromMessage } from '../Parent/fromMessage.js'
import { CastType, type Message, MessageType } from '../Protobufs/message_pb.js'
import {
  Cast_InvalidEmbedsError,
  Cast_InvalidMessageTypeError,
} from './errors.js'
import type { Cast } from './types.js'

export async function Cast_fromMessage(
  client: Client,
  message: Message,
): Promise<Cast_fromMessage.ReturnType> {
  const meta = Meta_fromMessage(message)

  // @TODO: separate error here
  if (!message.data) throw new Error('`data` must be defined in Cast message.')
  if (
    message.data.type !== MessageType.CAST_ADD ||
    message.data.body.case !== 'castAddBody'
  )
    throw new Cast_InvalidMessageTypeError({ hash: meta.hash })

  const isLong = message.data.body.value.type === CastType.LONG_CAST
  const mentions = (() => {
    if (message.data.body.value.mentions.length === 0) return undefined
    const mentions = []
    for (let i = 0; i < message.data.body.value.mentions.length; i++) {
      mentions.push({
        fid: message.data.body.value.mentions[i],
        position: message.data.body.value.mentionsPositions[i],
      })
    }
    return mentions
  })()

  const embeds = (() => {
    if (message.data.body.value.embeds.length === 0) return undefined
    const embedsOrUndefineds = message.data.body.value.embeds.map(({ embed }) =>
      Embed_fromMessage(embed),
    )
    if (embedsOrUndefineds.indexOf(undefined) !== -1)
      throw new Cast_InvalidEmbedsError({ hash: meta.hash })
    return embedsOrUndefineds as Embed[]
  })()
  const parent = Parent_fromMessage(message.data.body.value.parent)

  const rawText = message.data.body.value.text
  return {
    meta,
    isLong,
    fid: message.data.fid,
    timestamp: message.data.timestamp,
    text: {
      value: await (async () => {
        if (!mentions) return rawText

        let chars = rawText.split('')
        const mentionsUsernames = await Promise.all(
          mentions.map(async (mention) => ({
            username: await Actions_UserData_getUserDataUsername(client, {
              fid: mention.fid,
            }),
            ...mention,
          })),
        )
        for (const mention of mentionsUsernames.reverse()) {
          chars = [
            ...chars.slice(0, mention.position),
            '@',
            mention.username,
            ...chars.slice(mention.position),
          ]
        }
        return chars.join('')
      })(),
      mentions,
      embeds,
      raw: rawText,
    },
    parent,
  }
}

export declare namespace Cast_fromMessage {
  type ReturnType = Cast

  type ErrorType =
    | Cast_InvalidMessageTypeError
    | Meta_fromMessage.ErrorType
    | Embed_fromMessage.ErrorType
    | Parent_fromMessage.ErrorType
    | GlobalErrorType
}

Cast_fromMessage.parseError = (error: unknown) =>
  error as Cast_fromMessage.ErrorType