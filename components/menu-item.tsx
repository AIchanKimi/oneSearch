import type { ActionProvider } from '@/types'
import { Context } from '@/entrypoints/content/App'
import { cn } from '@/lib/utils'
import { useContext } from 'react'
import styles from './menu-item.module.css'

type MenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
  onClick: (provider: ActionProvider) => void // 简化：只接收点击回调
}

function MenuItem({ provider, size = 'normal', onClick }: MenuItemProps) {
  const { theme } = useContext(Context)

  const handleClick = () => {
    onClick(provider)
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
        theme === 'dark' && styles.buttonDark,
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
