import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type PanelMenuProps = {
  items: ActionProvider[]
}

function PanelMenu({ items }: PanelMenuProps) {
  return (items && items.length > 0) && (
    <div
      className="bg-background rounded-md fixed z-50 flex items-center gap-1"
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

export default PanelMenu
