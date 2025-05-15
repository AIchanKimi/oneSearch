import type { FetchRemoteProvidersResponse } from '@/types'
import { convertRemoteToActionProvider } from '@/utils/convert-provider'
import { ActionProviderStorage } from '@/utils/storage'

export default defineBackground(() => {
  // 监听扩展安装事件
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      try {
        // 通过 fetch 获取全部 provider
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/provider`)
        if (!response.ok) {
          throw new Error('Failed to fetch providers')
        }

        const data = await response.json() as FetchRemoteProvidersResponse

        // 转换并装填到存储中
        const actionProviders = data.data.providers.map(convertRemoteToActionProvider)
        await ActionProviderStorage.setValue(actionProviders)
      }
      catch (error) {
        console.error('Error fetching providers:', error)
      }
    }
  })
})
