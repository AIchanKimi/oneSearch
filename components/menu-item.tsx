import type { ActionProvider } from '@/types'
import { cn } from '@/lib/utils'
import { handleAction } from '@/utils/handle-action'
import styles from './menu-item.module.css'

type MenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
  menuAction: (arg: boolean) => void
  setPinnedAction?: (pinned: boolean) => void
}

function MenuItem({ provider, size = 'normal', menuAction, setPinnedAction }: MenuItemProps) {
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
      onClick={async () => await handleAction(provider, menuAction, setPinnedAction)}
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
