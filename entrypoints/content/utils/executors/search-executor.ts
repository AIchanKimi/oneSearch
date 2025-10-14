import type { ActionExecutor, ActionResult, SearchActionInput } from '../action-types'

/**
 * 搜索动作执行器 - 纯函数
 * 负责在新窗口中打开搜索链接
 */
export const searchExecutor: ActionExecutor<SearchActionInput> = {
  async execute(input: SearchActionInput): Promise<ActionResult> {
    try {
      // 替换链接中的占位符
      const url = input.link.replaceAll('{selectedText}', input.selectedText)
      // 在新窗口中打开链接
      const newWindow = window.open(url, '_blank')
      newWindow?.focus()

      return {
        success: true,
        error: undefined,
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
