import type { ActionProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type ActionProviderCardProps = {
  item: ActionProvider
  index: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onPropertyChange: (index: number, property: keyof ActionProvider, value: any) => void
}

export function ActionProviderCard({
  item,
  index,
  onEdit,
  onDelete,
  onPropertyChange,
}: ActionProviderCardProps) {
  const [lastClickTime, setLastClickTime] = useState(0)

  const handleDeleteClick = () => {
    const now = Date.now()
    const timeDiff = now - lastClickTime

    if (timeDiff < 300) {
      // 如果是双击（两次点击间隔小于300ms），执行删除操作
      onDelete(index)
    }
    else {
      // 单击时，显示提示信息
      toast.info('请双击以确认删除')
    }

    // 更新最后点击时间
    setLastClickTime(now)
  }

  return (
    <Card className="mb-4 flex flex-col">
      <CardContent className="space-y-4 flex-1 p-4">
        {/* 上部分：左边是icon，中间是label和类型与标签，右边是操作按钮 */}
        <div className="flex items-start gap-4 pb-3 border-b">
          {/* 左侧图标 */}
          <div className="flex-shrink-0">
            {item.icon
              ? (
                  <img
                    src={item.icon}
                    alt="图标"
                    className="w-12 h-12 object-contain border rounded p-1"
                  />
                )
              : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">无图标</span>
                  </div>
                )}
          </div>

          {/* 中间标签、类型和标签分类 */}
          <div className="flex-1">
            <div className="font-medium text-lg mb-1">{item.label || '无标签'}</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                类型:
                {' '}
                {item.type}
              </div>
              {item.tag !== undefined && (
                <div>
                  标签:
                  {' '}
                  {item.tag || '无分类'}
                </div>
              )}
            </div>
          </div>

          {/* 右侧操作按钮 */}
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(index)} title="编辑">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700"
              title="双击删除"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 下部分：气泡显示和面板显示，使用Switch直接切换 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`bubble-${index}`} className="cursor-pointer">气泡显示</Label>
            <Switch
              id={`bubble-${index}`}
              checked={item.bubble}
              onCheckedChange={checked => onPropertyChange(index, 'bubble', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor={`panel-${index}`} className="cursor-pointer">面板显示</Label>
            <Switch
              id={`panel-${index}`}
              checked={item.panel}
              onCheckedChange={checked => onPropertyChange(index, 'panel', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
