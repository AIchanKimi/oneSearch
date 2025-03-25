import type { ActionProvider } from '@/types'
import { X } from 'lucide-react'
import MenuItem from './menu-item'
import { Button } from './ui/button'

type PanelProps = {
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Panel({ items, setShowPanel }: PanelProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowPanel(false)}
    >
      <div
        className="bg-background rounded-lg p-8 shadow-lg max-w-4xl w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">应用列表</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
            <X></X>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map(item => (
            <MenuItem
              key={item.label}
              provider={item}
              menuAction={() => setShowPanel(true)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Panel
