import type { ActionResult } from '../utils/action-types'
import { PanelPinStorage } from '@/utils/storage'
import { useCallback } from 'react'

export type UseActionEffectsOptions = {
  onActionStart?: () => void
  onActionComplete?: (result: ActionResult) => void
  onActionError?: (error: string) => void
  shouldShowToast?: boolean
}

export type UseActionEffectsReturn = {
  handleActionEffect: (result: ActionResult) => Promise<void>
  clearSelection: () => void
}

/**
 * 管理动作执行后的UI副作用
 * 处理面板关闭、固定状态、文本选择清除等副作用
 */
export function useActionEffects(options: UseActionEffectsOptions = {}): UseActionEffectsReturn {
  const {
    onActionStart,
    onActionComplete,
    onActionError,
    shouldShowToast = true,
  } = options

  // 清除文本选择
  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
  }, [])

  // 处理动作执行的副作用
  const handleActionEffect = useCallback(async (result: ActionResult): Promise<void> => {
    // 触发开始回调
    onActionStart?.()

    try {
      if (result.success) {
        // 读取面板固定设置
        const keepPanelOpen = await PanelPinStorage.getValue()

        // 处理需要关闭UI的情况
        if (result.shouldCloseUI && !keepPanelOpen) {
          // 这个逻辑将在UI组件中处理，这里只是标记
          console.warn('UI should close after action')
        }

        // 处理需要显示面板的情况
        if (result.shouldShowPanel) {
          console.warn('Panel should be shown')
        }

        // 如果动作成功且需要关闭UI，清除文本选择
        if (result.shouldCloseUI) {
          clearSelection()
        }

        // 触发完成回调
        onActionComplete?.(result)

        // 显示成功提示（可选）
        if (shouldShowToast) {
          // 这里可以集成toast组件
          console.warn('Action completed successfully')
        }
      }
      else {
        // 处理错误情况
        console.error('Action failed:', result.error)
        onActionError?.(result.error || 'Unknown error')

        // 显示错误提示（可选）
        if (shouldShowToast) {
          // 这里可以集成error toast组件
          console.error('Action failed:', result.error)
        }
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in action effects'
      console.error('Error in action effects:', errorMessage)
      onActionError?.(errorMessage)
    }
  }, [onActionStart, onActionComplete, onActionError, shouldShowToast, clearSelection])

  return {
    handleActionEffect,
    clearSelection,
  }
}
