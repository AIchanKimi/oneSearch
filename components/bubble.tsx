import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type BubbleMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Bubble({ mousePosition, items, setShowPanel }: BubbleMenuProps) {
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
          menuAction={() => setShowPanel(true)}
        />
      ))}
    </div>
  )
}

export default Bubble
