import { onMessage } from '@/utils/message'

export default defineBackground(() => {
  onMessage('getStringLength', (message) => {
    return message.data.length
  })
})
