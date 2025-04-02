import type { ActionProvider } from '@/types'
import { cn } from '@/lib/utils'
import { handleAction } from '@/utils/handle-action'
import styles from './menu-item.module.css'
import { Button } from './shadow-ui/button'

type MenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
  menuAction: (arg: boolean) => void
}

function MenuItem({ provider, size = 'normal', menuAction }: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      size={size === 'icon' ? 'icon' : 'sm'}
      key={provider.label}
      className={cn(styles.menuItem, size === 'normal' && styles.normal)}
      onClick={() => handleAction(provider, menuAction)}
    >
      <div className={styles.contentContainer}>
        <img className={styles.icon} src={provider.icon} alt="" />
        { size === 'normal' && (
          <span>
            {provider.label}
          </span>
        )}
      </div>
    </Button>
  )
}

export default MenuItem
