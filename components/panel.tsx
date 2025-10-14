import type { ActionProvider } from '@/types'
import { Context } from '@/entrypoints/content/App'
import { convertProviderTag } from '@/utils/convert-provider-tag'
import { GroupOrderStorage } from '@/utils/storage'
import { Pin, PinOff, X } from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import MenuItem from './menu-item'
import styles from './panel.module.css'
import { Button } from './shadow-ui/button'

type PanelProps = {
  items: ActionProvider[]
  isPinned: boolean
  onClose: () => void
  onTogglePin: () => void
  onMenuItemClick: (provider: ActionProvider) => void // 新增：统一的action处理
}

function Panel({
  items,
  isPinned,
  onClose,
  onTogglePin,
  onMenuItemClick,
}: PanelProps) {
  const { theme } = useContext(Context)

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
      onClick={onClose}
    >
      <div
        className={`${styles.panelContainer} ${theme === 'dark' ? styles.panelContainerDark : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>应用列表</h2>
          <div className={styles.panelControls}>
            {/* 固定按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePin}
              title={isPinned ? '取消固定' : '固定面板'}
            >
              {isPinned ? <Pin /> : <PinOff />}
            </Button>
            {/* 关闭按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="关闭面板"
            >
              <X />
            </Button>
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.groupsContainer}>
            {groupedItems.length > 0
              ? (
                  groupedItems.map(([tag, providers]) => (
                    <div key={tag} className={styles.groupItem}>
                      <h3 className={styles.groupTitle}>{convertProviderTag(tag)}</h3>
                      <div className={styles.itemsContainer}>
                        {providers.map(item => (
                          <MenuItem
                            key={item.providerId}
                            provider={item}
                            onClick={onMenuItemClick}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )
              : (
                  <div className={styles.emptyState}>
                    <span>无选项</span>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Panel
