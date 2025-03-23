import type { ActionProvider } from '@/types'
import MenuItem from './menu-item'

type PanelProps = {
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Panel({ items, setShowPanel }: PanelProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-background rounded-lg p-8 shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">应用列表</h2>
          <button
            onClick={() => setShowPanel(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="关闭"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
