import type { ActionProvider } from '@/types'
import type { DropResult } from '@hello-pangea/dnd'
import { SortableSheet } from '@/components/SortableSheet'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { ActionProviderStorage, GroupOrderStorage } from '@/utils/storage'
import { MoveVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageTitle } from '../components/PageTitle'

type SortableActionProvider = {
  id: string
} & ActionProvider

type SortableTag = {
  id: string
  label: string
}

export function SortSettings() {
  const [data, setData] = useState<ActionProvider[]>([])
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false)
  const [bubbleItemsForSort, setBubbleItemsForSort] = useState<SortableActionProvider[]>([])
  const [isGroupOrderSheetOpen, setIsGroupOrderSheetOpen] = useState(false)
  const [groupOrderTags, setGroupOrderTags] = useState<SortableTag[]>([])

  useEffect(() => {
    async function fetchData() {
      const storageData = await ActionProviderStorage.getValue()
      setData(storageData)
    }
    fetchData()
  }, [])

  const initSortableItems = () => {
    const bubbleItems = data.filter(item => item.bubble === true)
    const sorted = [...bubbleItems].sort((a, b) => {
      if (a.order === undefined && b.order === undefined)
        return 0
      if (a.order === undefined)
        return 1
      if (b.order === undefined)
        return -1
      return a.order - b.order
    })
    setBubbleItemsForSort(sorted.map((item, index) => ({
      ...item,
      id: `${item.label}-${item.type}-${index}`,
    })))
  }

  const handleOpenSortSheet = () => {
    initSortableItems()
    setIsOrderSheetOpen(true)
  }

  const handleOpenGroupSortSheet = async () => {
    const tags = Array.from(new Set(data.map(item => item.tag || '其他')))
    const stored = await GroupOrderStorage.getValue()
    const initial = [
      ...stored.filter(tag => tags.includes(tag)),
      ...tags.filter(tag => !stored.includes(tag)),
    ]
    setGroupOrderTags(initial.map(tag => ({ id: tag, label: tag })))
    setIsGroupOrderSheetOpen(true)
  }

  const handleGroupDragEnd = (result: DropResult) => {
    if (!result.destination)
      return
    const newTags = Array.from(groupOrderTags)
    const [moved] = newTags.splice(result.source.index, 1)
    newTags.splice(result.destination.index, 0, moved)
    setGroupOrderTags(newTags)
  }

  const handleSaveGroupOrder = async () => {
    await GroupOrderStorage.setValue(groupOrderTags.map(tag => tag.label))
    setIsGroupOrderSheetOpen(false)
    toast.success('分组排序已保存')
  }

  const handleBubbleDragEnd = (result: DropResult) => {
    if (!result.destination)
      return

    const items = Array.from(bubbleItemsForSort)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setBubbleItemsForSort(items)
  }

  const handleSaveBubbleOrder = async () => {
    const newData = [...data]

    bubbleItemsForSort.forEach((item, index) => {
      const dataIndex = newData.findIndex(d =>
        d.label === item.label
        && d.type === item.type
        && d.tag === item.tag,
      )
      if (dataIndex !== -1) {
        newData[dataIndex] = {
          ...newData[dataIndex],
          order: index,
        }
      }
    })

    setData(newData)
    await ActionProviderStorage.setValue(newData)
    setIsOrderSheetOpen(false)
    toast.success('气泡排序已保存')
  }

  const renderBubbleItem = (item: SortableActionProvider) => (
    <div className="flex items-center">
      {item.icon && (
        <div className="mr-3 flex items-center justify-center w-6 h-6 flex-shrink-0">
          <img src={item.icon} alt="" className="max-w-full max-h-full" />
        </div>
      )}
      <span className="truncate">{item.label}</span>
    </div>
  )

  const renderGroupTagItem = (item: SortableTag) => (
    <>{item.label}</>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="排序设置"
        description="管理气泡项目和分组的显示顺序"
      />

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">排序选项</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={handleOpenGroupSortSheet} className="flex items-center gap-2">
              <MoveVertical size={16} />
              排序分组
            </Button>
            <Button onClick={handleOpenSortSheet} className="flex items-center gap-2">
              <MoveVertical size={16} />
              排序气泡
            </Button>
          </div>
        </div>
      </div>

      <SortableSheet<SortableActionProvider>
        open={isOrderSheetOpen}
        onOpenChange={setIsOrderSheetOpen}
        title="排序气泡项目"
        description="拖拽下方项目调整气泡显示顺序"
        items={bubbleItemsForSort}
        onDragEnd={handleBubbleDragEnd}
        onSave={handleSaveBubbleOrder}
        renderItem={renderBubbleItem}
      />

      <SortableSheet<SortableTag>
        open={isGroupOrderSheetOpen}
        onOpenChange={setIsGroupOrderSheetOpen}
        title="排序分组"
        description="拖拽调整分组显示顺序"
        items={groupOrderTags}
        onDragEnd={handleGroupDragEnd}
        onSave={handleSaveGroupOrder}
        renderItem={renderGroupTagItem}
      />

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default SortSettings
