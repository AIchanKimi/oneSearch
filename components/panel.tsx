import type { ActionProvider } from '@/types'
import { GroupOrderStorage } from '@/utils/storage'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import MenuItem from './menu-item'
import styles from './panel.module.css'
import { Button } from './shadow-ui/button'

type PanelProps = {
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Panel({ items, setShowPanel }: PanelProps) {
  // 读取存储的分组顺序
  const [groupOrder, setGroupOrder] = useState<string[]>([])

  useEffect(() => {
    async function fetchOrder() {
      const order = await GroupOrderStorage.getValue()
      setGroupOrder(order)
    }
    fetchOrder()
  }, [])

  // 按tag对items进行分组并应用存储顺序
  const groupedItems = useMemo(() => {
    const groups: Record<string, ActionProvider[]> = {}
    items.forEach((item) => {
      const tag = item.tag || '其他'
      if (!groups[tag])
        groups[tag] = []
      groups[tag].push(item)
    })
    const tags = Object.keys(groups)
    const ordered = [
      ...groupOrder.filter(t => tags.includes(t)),
      ...tags.filter(t => !groupOrder.includes(t)).sort(),
    ]
    return ordered.map(tag => [tag, groups[tag]] as [string, ActionProvider[]])
  }, [items, groupOrder])

  return (
    <div
      className={styles.overlay}
      onClick={() => setShowPanel(false)}
    >
      <div
        className={styles.panelContainer}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>应用列表</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
            <X />
          </Button>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.groupsContainer}>
            {groupedItems.map(([tag, providers]) => (
              <div key={tag} className={styles.groupItem}>
                <h3 className={styles.groupTitle}>{tag}</h3>
                <div className={styles.itemsContainer}>
                  {providers.map(item => (
                    <MenuItem
                      key={item.label}
                      provider={item}
                      menuAction={setShowPanel}
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
