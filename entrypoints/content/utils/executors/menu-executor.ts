import type { ActionExecutor, ActionResult, MenuActionInput } from '../action-types'

/**
 * 菜单动作执行器 - 纯函数
 * 负责处理菜单展开动作
 */
export const menuExecutor: ActionExecutor<MenuActionInput> = {
  async execute(): Promise<ActionResult> {
    try {
      return {
        success: true,
        shouldCloseUI: false, // 菜单动作不关闭UI，而是切换到面板
        shouldShowPanel: true, // 显示面板
        error: undefined,
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Menu action failed'

      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}

/**
 * 创建菜单动作的工厂函数
 */
export function createMenuAction() {
  return menuExecutor.execute({})
}
