import type { DropResult } from '@hello-pangea/dnd'
import { SortableSheet } from '@/components/SortableSheet'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { ActionProviderStorage, GroupOrderStorage } from '@/utils/storage'
import { MoveVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageTitle } from '../components/PageTitle'

type SortableTag = {
  id: string
  label: string
}

export function SortSettings() {
  const [data, setData] = useState<any[]>([])
  const [isGroupOrderSheetOpen, setIsGroupOrderSheetOpen] = useState(false)
  const [groupOrderTags, setGroupOrderTags] = useState<SortableTag[]>([])

  useEffect(() => {
    async function fetchData() {
      const storageData = await ActionProviderStorage.getValue()
      setData(storageData)
    }
    fetchData()
  }, [])

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

  const renderGroupTagItem = (item: SortableTag) => (
    <>{item.label}</>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="分组排序"
        description="管理分组的显示顺序"
      />

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">分组排序设置</h2>
          <p className="text-sm text-gray-500 mb-4">
            调整分组的显示顺序，点击下方按钮可打开排序面板
          </p>
          <Button onClick={handleOpenGroupSortSheet} className="flex items-center gap-2">
            <MoveVertical size={16} />
            排序分组
          </Button>
        </div>
      </div>

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
