import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type QuickMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
}

function QuickMenu({ mousePosition, items }: QuickMenuProps) {
  console.log(items);
  return (items && items.length > 0) && (
    <div
      className="bg-background rounded-md fixed z-50 flex items-center gap-1"
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
      }}
    >
      {items.map(item => (
        <MenuItem
          key={item.label}
          provider={item}
        />
      ))}
    </div>
  )
}

export default QuickMenu
