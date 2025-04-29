import type { DropResult } from '@hello-pangea/dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { ActionProviderStorage, GroupOrderStorage } from '@/utils/storage'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageTitle } from '../components/PageTitle'

type SortableTag = {
  id: string
  label: string
}

export function SortSettings() {
  const [groupOrderTags, setGroupOrderTags] = useState<SortableTag[]>([])

  useEffect(() => {
    async function fetchData() {
      const storageData = await ActionProviderStorage.getValue()

      const tags = Array.from(new Set(storageData.map(item => item.tag || '其他')))
      const storedOrder = await GroupOrderStorage.getValue()

      // 排序标签：先显示已存储排序中的标签，再显示新标签
      const sortedTags = [
        ...storedOrder.filter(tag => tags.includes(tag)),
        ...tags.filter(tag => !storedOrder.includes(tag)),
      ]

      setGroupOrderTags(sortedTags.map(tag => ({ id: tag, label: tag })))
    }
    fetchData()
  }, [])

  const handleGroupDragEnd = async (result: DropResult) => {
    if (!result.destination)
      return

    const newTags = Array.from(groupOrderTags)
    const [moved] = newTags.splice(result.source.index, 1)
    newTags.splice(result.destination.index, 0, moved)

    setGroupOrderTags(newTags)

    // 拖拽结束后立即保存排序
    await GroupOrderStorage.setValue(newTags.map(tag => tag.label))
    toast.success('分组排序已更新')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="面板设置"
        description="管理面板分组的显示顺序"
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">面板分组排序</h2>
          <p className="text-sm text-zinc-500 mb-4">
            拖拽下方分组标签调整面板中的显示顺序，排序将自动保存
          </p>

          <div className="space-y-4">
            <DragDropContext onDragEnd={handleGroupDragEnd}>
              <Droppable droppableId="sortable-group-list" direction="horizontal">
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-2 overflow-y-auto max-h-[400px] scrollbar-thin p-2"
                  >
                    {groupOrderTags.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
                            inline-flex items-center gap-2 rounded-md text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          >
                            {item.label}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CardContent>
      </Card>

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default SortSettings
