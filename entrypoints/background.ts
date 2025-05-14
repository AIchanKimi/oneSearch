import type { ActionProvider, FetchRemoteProvidersResponse, RemoteProvider } from '@/types'
import { ActionProviderStorage } from '@/utils/storage'

function convertRemoteToActionProvider(remoteProvider: RemoteProvider): ActionProvider {
  return {
    providerId: remoteProvider.providerId,
    label: remoteProvider.label,
    homepage: remoteProvider.homepage,
    icon: remoteProvider.icon,
    tag: remoteProvider.tag,
    bubble: true, // 默认值
    panel: true, // 默认值
    type: 'search', // 假设默认类型为 'search'
    payload: {
      link: remoteProvider.link,
      selectedText: '',
      source: '',
    },
  }
}

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
