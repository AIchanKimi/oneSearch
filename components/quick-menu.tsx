import type { Provider } from '@/types'
import MenuItem from './menu-item'
import { Button } from './ui/button'

type QuickMenuProps = {
  mousePosition: { x: number, y: number }
  items?: Provider []
  selectedText?: string
}

function QuickMenu({ mousePosition, items, selectedText }: QuickMenuProps) {

  return (items && items.length > 0) && (
    <div
      className="bg-background rounded-md fixed z-50 flex items-center gap-1"
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
      }}
    >
      {items.map((item) => (
        <MenuItem 
          key={item.label}
          provider={item}
          selectedText={selectedText}
        />
      ))}
    </div>
  )
}

export default QuickMenu
