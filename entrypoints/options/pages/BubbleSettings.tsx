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
  }

  // 处理气泡偏移值变化完成后的提示
  const handleBubbleOffsetCommit = async (axis: 'x' | 'y') => {
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

          <div className="grid grid-cols-[auto_1fr] gap-6 mb-10 max-w-[800px] mx-auto">
            {/* 左上角单元格 - 留空作为间隔 */}
            <div></div>

            {/* 右上角单元格 - X轴滑块 */}
            <div className="flex flex-col items-center">
              <div className="flex justify-between w-full mb-1">
                <div className="text-sm text-gray-600">← 左</div>
                <div className="font-medium text-sm">
                  {bubbleOffset.x}
                  px
                </div>
                <div className="text-sm text-gray-600">右 →</div>
              </div>
              <Slider
                id="bubble-offset-x"
                min={-100}
                max={100}
                step={1}
                value={[bubbleOffset.x]}
                onValueChange={value => handleBubbleOffsetChange('x', value)}
                onValueCommit={() => handleBubbleOffsetCommit('x')}
              />
            </div>

            {/* 左下角单元格 - Y轴滑块，使用h-full适应与预览区域相同的高度 */}
            <div className="flex h-full justify-self-end">
              <div className="w-10 flex flex-col justify-between mr-4">
                <div className="text-sm text-gray-600">↑ 上</div>
                <div className="font-medium text-sm text-center">
                  {bubbleOffset.y}
                  px
                </div>
                <div className="text-sm text-gray-600">↓ 下</div>
              </div>
              <Slider
                id="bubble-offset-y"
                min={-100}
                max={100}
                step={1}
                value={[-bubbleOffset.y]}
                onValueChange={value => handleBubbleOffsetChange('y', value.map(v => -v))}
                onValueCommit={() => handleBubbleOffsetCommit('y')}
                orientation="vertical"
              />
            </div>

            {/* 右下角单元格 - 预览区域，使用aspect-square确保是正方形 */}
            <div className="aspect-square w-full bg-gray-100 relative rounded-lg flex items-center justify-center border">
              {/* 水平虚线表示 Y 轴的 0 位置 */}
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-400"></div>
              {/* 垂直虚线表示 X 轴的 0 位置 */}
              <div className="absolute bottom-0 top-0 left-1/2 border-l border-dashed border-gray-400"></div>
              <div
                className="absolute w-10 h-10 bg-white rounded shadow-lg border flex items-center justify-center"
                style={{
                  transform: `translate(${bubbleOffset.x}px, ${bubbleOffset.y}px)`,
                  top: 'calc(50%)',
                  left: 'calc(50%)',
                }}
              >
                <span className="text-xs">气泡</span>
              </div>
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
