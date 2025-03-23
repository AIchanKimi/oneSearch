import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type PanelProps = {
  items: ActionProvider[]
}

function Panel({ items }: PanelProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-background rounded-lg p-8 shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">应用列表</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map(item => (
            <MenuItem
              key={item.label}
              provider={item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Panel
