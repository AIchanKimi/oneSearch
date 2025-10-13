import type { ActionProvider } from '@/types'
import { useActionEffects } from '@/entrypoints/content/hooks/useActionEffects'
import { createActionHandler } from '@/entrypoints/content/utils/action-handler'
import { cn } from '@/lib/utils'
import styles from './menu-item.module.css'

type MenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
  menuAction: (showPanel: boolean) => void
  setPinnedAction?: (pinned: boolean) => void
}

function MenuItem({ provider, size = 'normal', menuAction, setPinnedAction }: MenuItemProps) {
  const actionHandler = createActionHandler()
  const { handleActionEffect } = useActionEffects({
    onActionComplete: (result) => {
      // 处理UI副作用
      if (result.shouldShowPanel) {
        menuAction(true)
      }

      if (result.shouldCloseUI) {
        menuAction(false)

        // 设置固定状态（如果提供了回调）
        if (setPinnedAction) {
          // 这里需要读取存储设置，为了简化暂时直接调用
          setPinnedAction(false) // 将在useUIControl中优化
        }
      }
    },
    onActionError: (error) => {
      console.error('Action failed:', error)
      // 这里可以显示错误提示
    },
  })

  const handleClick = async () => {
    try {
      // 执行动作
      const result = await actionHandler.executeAction(provider)

      // 处理副作用
      await handleActionEffect(result)
    }
    catch (error) {
      console.error('Error executing action:', error)
    }
  }

  return (
    <button
      type="button"
      key={provider.providerId}
      className={cn(
        styles.button,
        styles.ghost,
        size === 'icon' ? styles.sizeIcon : styles.sizeSm,
        styles.menuItem,
        size === 'normal' && styles.normal,
      )}
      onClick={handleClick}
    >
      <div className={styles.contentContainer}>
        <img className={styles.icon} src={provider.icon} alt="" />
        {size === 'normal' && (
          <span>
            {provider.label}
          </span>
        )}
      </div>
    </button>
  )
}

export default MenuItem
