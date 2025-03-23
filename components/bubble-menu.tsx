import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type BubbleMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
}

function BubbleMenu({ mousePosition, items }: BubbleMenuProps) {
  return (items && items.length > 0) && (
    <div
      className="bg-background rounded-md fixed flex items-center gap-1"
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
        zIndex: 9999,
      }}
    >
      {items.map(item => (
        <MenuItem
          size="icon"
          key={item.label}
          provider={item}
        />
      ))}
    </div>
  )
}

export default BubbleMenu
