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
        uiAction: {
          type: 'close',
          target: 'current', // 智能关闭当前显示的 UI，检查固定状态
        },
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
