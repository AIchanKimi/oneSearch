import type { ActionProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

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
  return (
    <Card className="mb-4 flex flex-col">
      <CardContent className="space-y-4 flex-1 p-4">
        {/* 上部分：左边是icon，右边是label和类型与标签 */}
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

          {/* 右侧标签、类型和标签分类 */}
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

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-2 mt-auto pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(index)}>
            编辑
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(index)}>
            删除
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
