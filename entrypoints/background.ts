import { actionProvider } from '@/provider/action'
import { searchProvider } from '@/provider/search'
import { ActionProviderStorage } from '@/utils/storage'

export default defineBackground(() => {
  // 监听扩展安装事件
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      // 获取当前存储的provider
      const currentProviders = await ActionProviderStorage.getValue()

      // 如果存储为空，则装填全部内容
      if (currentProviders.length === 0) {
        // 合并所有providers并装填到存储中
        const allProviders = [...searchProvider, ...actionProvider]
        await ActionProviderStorage.setValue(allProviders)
      }
    }
  })
})
