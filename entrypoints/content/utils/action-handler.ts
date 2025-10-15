import type { ActionProvider } from '@/types'
import type { ActionResult } from './action-types'
import { copyExecutor, menuExecutor, searchExecutor } from './executors'

/**
 * 动作处理器 - 统一调度各种类型的动作
 * 负责选择合适的执行器并执行动作
 */
export class ActionHandler {
  private executors = {
    copy: copyExecutor,
    search: searchExecutor,
    menu: menuExecutor,
  }

  /**
   * 执行指定的动作
   * @param provider 动作提供商
   * @returns 执行结果
   */
  async executeAction(provider: ActionProvider): Promise<ActionResult> {
    const { type } = provider

    switch (type) {
      case 'copy':
        return await this.executors.copy.execute({
          selectedText: provider.payload.selectedText,
        })

      case 'search':
        return await this.executors.search.execute({
          link: provider.payload.link,
          selectedText: provider.payload.selectedText,
        })

      case 'menu':
        return await this.executors.menu.execute({})

      default: {
        // 对于未知的类型，我们使用类型断言来处理
        const unsupportedType = type as never
        return {
          success: false,
          error: `Unsupported action type: ${String(unsupportedType)}`,
        }
      }
    }
  }

  /**
   * 批量执行动作（用于未来扩展）
   * @param providers 动作提供商列表
   * @returns 执行结果列表
   */
  async executeActions(providers: ActionProvider[]): Promise<ActionResult[]> {
    const results = await Promise.allSettled(
      providers.map(provider => this.executeAction(provider)),
    )

    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      }
      else {
        return {
          success: false,
          error: result.reason?.message || 'Unknown error',
        }
      }
    })
  }

  /**
   * 验证动作提供商是否有效
   * @param provider 动作提供商
   * @returns 是否有效
   */
  validateProvider(provider: ActionProvider): boolean {
    const { type, payload } = provider

    // 检查类型是否支持
    if (!['copy', 'search', 'menu'].includes(type)) {
      return false
    }

    // 检查payload是否有效
    switch (type) {
      case 'copy':
        return typeof payload.selectedText === 'string' && payload.selectedText.length > 0

      case 'search':
        return typeof payload.link === 'string'
          && typeof payload.selectedText === 'string'
          && payload.selectedText.length > 0

      case 'menu':
        return true // menu类型不需要特定参数

      default:
        return false
    }
  }
}

/**
 * 创建ActionHandler实例的工厂函数
 */
export function createActionHandler(): ActionHandler {
  return new ActionHandler()
}
