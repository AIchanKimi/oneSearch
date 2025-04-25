import type { ActionProvider } from '@/types'
import type { DropResult } from '@hello-pangea/dnd'
import { SortableSheet } from '@/components/SortableSheet'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Toaster } from '@/components/ui/sonner'
import { ActionProviderStorage, BubbleOffsetStorage } from '@/utils/storage'
import { MoveVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageTitle } from '../components/PageTitle'

type SortableActionProvider = {
  id: string
} & ActionProvider

export function BubbleSettings() {
  // 气泡偏移值
  const [bubbleOffset, setBubbleOffset] = useState<{ x: number, y: number }>({ x: 20, y: 20 })
  // 气泡排序相关状态
  const [data, setData] = useState<ActionProvider[]>([])
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false)
  const [bubbleItemsForSort, setBubbleItemsForSort] = useState<SortableActionProvider[]>([])

  useEffect(() => {
    // 加载气泡偏移设置和服务提供商数据
    const loadData = async () => {
      const offset = await BubbleOffsetStorage.getValue()
      setBubbleOffset(offset)

      const storageData = await ActionProviderStorage.getValue()
      setData(storageData)
    }
    loadData()
  }, [])

  // 处理气泡偏移值变化
  const handleBubbleOffsetChange = async (axis: 'x' | 'y', value: number[]) => {
    const numValue = value[0]
    const newOffset = { ...bubbleOffset, [axis]: numValue }
    setBubbleOffset(newOffset)
    await BubbleOffsetStorage.setValue(newOffset)
    toast.success(`气泡${axis === 'x' ? 'X' : 'Y'}轴偏移已更新`)
  }

  // 初始化可排序气泡项目
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="气泡设置"
        description="定制气泡显示的位置和行为"
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">气泡位置设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="bubble-offset-x">
                  气泡X轴偏移:
                  {bubbleOffset.x}
                  px
                </Label>
              </div>
              <Slider
                id="bubble-offset-x"
                min={-100}
                max={100}
                step={1}
                value={[bubbleOffset.x]}
                onValueChange={value => handleBubbleOffsetChange('x', value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                调整气泡在X轴方向的偏移量，正数为向右，负数为向左
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="bubble-offset-y">
                  气泡Y轴偏移:
                  {bubbleOffset.y}
                  px
                </Label>
              </div>
              <Slider
                id="bubble-offset-y"
                min={-100}
                max={100}
                step={1}
                value={[bubbleOffset.y]}
                onValueChange={value => handleBubbleOffsetChange('y', value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                调整气泡在Y轴方向的偏移量，正数为向下，负数为向上
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">气泡排序设置</h2>
          <p className="text-sm text-gray-500 mb-4">
            调整气泡图标的显示顺序，点击下方按钮可打开排序面板
          </p>
          <Button onClick={handleOpenSortSheet} className="flex items-center gap-2">
            <MoveVertical size={16} />
            排序气泡
          </Button>
        </CardContent>
      </Card>

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

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default BubbleSettings
