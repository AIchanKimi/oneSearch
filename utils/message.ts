import { defineExtensionMessaging } from '@webext-core/messaging'

type ProtocolMap = {
  getStringLength: (data: string) => number
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
