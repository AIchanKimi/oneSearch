import type { ActionExecutor, ActionResult, CopyActionInput } from '../action-types'

/**
 * 复制动作执行器 - 纯函数
 * 负责将文本复制到剪贴板
 */
export const copyExecutor: ActionExecutor<CopyActionInput> = {
  async execute(input: CopyActionInput): Promise<ActionResult> {
    try {
      await navigator.clipboard.writeText(input.selectedText)

      return {
        success: true,
        shouldCloseUI: true, // 默认复制后关闭UI
        error: undefined,
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Copy failed'

      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}

/**
 * 创建复制动作的工厂函数
 */
export function createCopyAction(selectedText: string) {
  return copyExecutor.execute({ selectedText })
}
