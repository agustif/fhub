import { type MessageJsonType, fromJson, toJson } from '@bufbuild/protobuf'
import type { CallOptions } from '@connectrpc/connect'
import type { Client } from '../../../../Internal/Client/types.js'
import type { GlobalErrorType } from '../../../../Internal/Errors/error.js'
import {
  MessagesResponseSchema,
  type SyncIdsJson,
  SyncIdsSchema,
} from '../../Protobufs/request_response_pb.js'

export declare namespace Actions_Sync_getAllMessagesBySyncIds {
  type ParametersType = Required<SyncIdsJson>
  type ReturnType = MessageJsonType<typeof MessagesResponseSchema>
  // @TODO: proper error handling
  type ErrorType = GlobalErrorType
}
export async function Actions_Sync_getAllMessagesBySyncIds(
  client: Client,
  parameters: Actions_Sync_getAllMessagesBySyncIds.ParametersType,
  options?: CallOptions,
): Promise<Actions_Sync_getAllMessagesBySyncIds.ReturnType> {
  const message = await client.connectRpcClient.getAllMessagesBySyncIds(
    fromJson(SyncIdsSchema, parameters),
    options,
  )
  return toJson(MessagesResponseSchema, message)
}

Actions_Sync_getAllMessagesBySyncIds.parseError = (error: unknown) =>
  error as Actions_Sync_getAllMessagesBySyncIds.ErrorType
