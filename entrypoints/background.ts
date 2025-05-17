import type { FetchRemoteProvidersResponse } from '@/types'
import { actionProvider } from '@/provider/action'
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
        const remoteProviders = data.data.providers.map(convertRemoteToActionProvider)
        const allProviders = [...actionProvider, ...remoteProviders]
        await ActionProviderStorage.setValue(allProviders)
      }
      catch (error) {
        console.error('Error fetching providers:', error)
      }
    }
    else if (details.reason === 'update') {
      try {
        // 获取本地 provider
        const localProviders = await ActionProviderStorage.getValue() || []
        // 检查 actionProvider 中是否有本地没有的 provider
        const localIds = new Set(localProviders.map((p: any) => p.providerId))
        const newProviders = actionProvider.filter(p => !localIds.has(p.providerId))
        if (newProviders.length > 0) {
          const updatedProviders = [...localProviders, ...newProviders]
          await ActionProviderStorage.setValue(updatedProviders)
        }
      }
      catch (error) {
        console.error('Error updating local providers:', error)
      }
    }
  })
})
