import type { ActionExecutor, ActionResult, SearchActionInput } from '../action-types'
import { UISettingsStorage } from '@/utils/storage'

/**
 * 搜索动作执行器 - 纯函数
 * 根据用户设置在不同窗口中打开搜索链接
 */
export const searchExecutor: ActionExecutor<SearchActionInput> = {
  async execute(input: SearchActionInput): Promise<ActionResult> {
    try {
      // 检测是否为纯占位符模板，如果是则直接替换不编码
      let url: string
      if (input.link === '{selectedText}') {
        url = input.selectedText // 直接替换，不编码
      }
      else {
        url = input.link.replaceAll('{selectedText}', encodeURIComponent(input.selectedText))
      }

      // 获取用户设置
      const uiSettings = await UISettingsStorage.getValue()
      const openMode = uiSettings?.search?.openMode || 'newTab'

      // 根据打开模式执行不同的操作
      switch (openMode) {
        case 'currentTab': {
          // 在当前标签页打开
          window.location.href = url
          return {
            success: true,
            uiAction: {
              type: 'close',
              target: 'current',
            },
          }
        }

        
        
        case 'incognitoWindow': {
          // 在隐私窗口打开
          const newWindow = window.open(url, '_blank', 'noopener,noreferrer,incognito')
          newWindow?.focus()
          return {
            success: true,
            uiAction: {
              type: 'close',
              target: 'current',
            },
          }
        }

        case 'popupWindow': {
          // 在弹窗窗口打开
          const popupSettings = uiSettings?.search?.popupWindow
          const width = popupSettings?.width || 800
          const height = popupSettings?.height || 600
          const left = popupSettings?.rememberPosition && popupSettings?.left !== undefined
            ? popupSettings.left
            : (window.screen.width - width) / 2
          const top = popupSettings?.rememberPosition && popupSettings?.top !== undefined
            ? popupSettings.top
            : (window.screen.height - height) / 2

          const newWindow = window.open(
            url,
            'popup',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,dependent=yes`,
          )
          newWindow?.focus()

          return {
            success: true,
            uiAction: {
              type: 'close',
              target: 'current',
            },
          }
        }

        case 'newTab':
        default: {
          // 默认：在新标签页打开并获得焦点
          const newWindow = window.open(url, '_blank')
          newWindow?.focus()
          return {
            success: true,
            uiAction: {
              type: 'close',
              target: 'current',
            },
          }
        }
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed'

      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}

/**
 * 创建搜索动作的工厂函数
 */
export function createSearchAction(link: string, selectedText: string) {
  return searchExecutor.execute({ link, selectedText })
}
