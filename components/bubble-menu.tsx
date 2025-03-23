import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type BubbleMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function BubbleMenu({ mousePosition, items, setShowPanel }: BubbleMenuProps) {
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
      <button
        className="p-2 hover:bg-gray-100 rounded-md"
        onClick={() => setShowPanel(true)}
        title="更多选项"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>
    </div>
  )
}

export default BubbleMenu
