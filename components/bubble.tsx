import type { ActionProvider } from '@/types'
import styles from './bubble.module.css'
import MenuItem from './menu-item'

type BubbleMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Bubble({ mousePosition, items, setShowPanel }: BubbleMenuProps) {
  return (items && items.length > 0) && (
    <div
      className={styles.bubbleContainer}
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
      }}
    >
      {items.map(item => (
        <MenuItem
          size="icon"
          key={item.providerId}
          provider={item}
          menuAction={setShowPanel}
        />
      ))}
    </div>
  )
}

export default Bubble
