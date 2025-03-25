import type { ActionProvider } from '@/types'
import { X } from 'lucide-react'
import { useMemo } from 'react'
import MenuItem from './menu-item'
import { Button } from './ui/button'

type PanelProps = {
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Panel({ items, setShowPanel }: PanelProps) {
  // 按tag对items进行分组
  const groupedItems = useMemo(() => {
    const groups: Record<string, ActionProvider[]> = {}

    items.forEach((item) => {
      const tag = item.tag || '其他'
      if (!groups[tag]) {
        groups[tag] = []
      }
      groups[tag].push(item)
    })

    return Object.entries(groups)
  }, [items])

  return (
    <div
      className="w-full h-full fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={() => setShowPanel(false)}
    >
      <div
        className="bg-background rounded-lg p-8 w-4/5 h-4/5 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">应用列表</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
            <X></X>
          </Button>
        </div>

        <div className="overflow-x-auto flex-grow">
          <div className="flex gap-4">
            {groupedItems.map(([tag, providers]) => (
              <div key={tag} className="min-w-fit">
                <h3 className="font-medium mb-4 text-lg">{tag}</h3>
                <div className="flex flex-col gap-2">
                  {providers.map(item => (
                    <MenuItem
                      key={item.label}
                      provider={item}
                      menuAction={() => setShowPanel(true)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Panel
