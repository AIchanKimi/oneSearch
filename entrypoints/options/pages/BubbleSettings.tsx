import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BubbleOffsetStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageTitle } from '../components/PageTitle'

export function BubbleSettings() {
  // 气泡偏移值
  const [bubbleOffset, setBubbleOffset] = useState<{ x: number, y: number }>({ x: 20, y: 20 })

  useEffect(() => {
    // 加载气泡偏移设置
    const loadBubbleOffset = async () => {
      const offset = await BubbleOffsetStorage.getValue()
      setBubbleOffset(offset)
    }
    loadBubbleOffset()
  }, [])

  // 处理气泡偏移值变化
  const handleBubbleOffsetChange = async (axis: 'x' | 'y', value: string) => {
    const numValue = Number.parseInt(value) || 0
    const newOffset = { ...bubbleOffset, [axis]: numValue }
    setBubbleOffset(newOffset)
    await BubbleOffsetStorage.setValue(newOffset)
    toast.success(`气泡${axis === 'x' ? 'X' : 'Y'}轴偏移已更新`)
  }

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
              <Label htmlFor="bubble-offset-x">气泡X轴偏移(像素)</Label>
              <Input
                id="bubble-offset-x"
                type="number"
                value={bubbleOffset.x}
                onChange={e => handleBubbleOffsetChange('x', e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                调整气泡在X轴方向的偏移量，正数为向右，负数为向左
              </p>
            </div>
            <div>
              <Label htmlFor="bubble-offset-y">气泡Y轴偏移(像素)</Label>
              <Input
                id="bubble-offset-y"
                type="number"
                value={bubbleOffset.y}
                onChange={e => handleBubbleOffsetChange('y', e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                调整气泡在Y轴方向的偏移量，正数为向下，负数为向上
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BubbleSettings
