import type { ActionProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { convertProviderType } from '@/utils/convert-provider-type'
import { Pencil } from 'lucide-react'

type ActionProviderCardProps = {
  item: ActionProvider
  onEdit: (providerId: number) => void
  onPropertyChange: (providerId: number, property: keyof ActionProvider, value: any) => void
}

export function ActionProviderCard({
  item,
  onEdit,
  onPropertyChange,
}: ActionProviderCardProps) {
  return (
    <Card className="flex flex-col h-48">
      <CardContent className="flex flex-col items-stretch justify-center gap-4 flex-1 p-4">
        {/* 上部分：左边是icon，中间是label和类型与标签，右边是操作按钮 */}
        <div className="flex items-start gap-4 pb-3 border-b">
          {/* 左侧图标 */}
          <div className="flex-shrink-0">
            {item.icon
              ? (
                  <a
                    href={(item.type === 'search' && item.payload.link) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.icon}
                      alt="图标"
                      className="w-12 h-12 object-contain border rounded p-1"
                    />
                  </a>
                )
              : (
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">无图标</span>
                  </div>
                )}
          </div>

          {/* 中间标签、类型和标签分类 */}
          <div className="flex-1">
            <a
              href={item.homepage || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lg mb-1 hover:underline underline-offset-4"
            >
              {item.label || '无标签'}
            </a>
            <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
              <div className="truncate">
                类型:
                {' '}
                {item.type}
              </div>
              {item.tag !== undefined && (
                <div className="truncate">
                  标签:
                  {' '}
                  {convertProviderType(item.tag)}
                </div>
              )}
            </div>
          </div>

          {/* 右侧操作按钮 */}
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item.providerId)}
              title="编辑"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 下部分：气泡显示和面板显示，使用Switch直接切换 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`bubble-${item.providerId}`} className="cursor-pointer">
              气泡显示
            </Label>
            <Switch
              id={`bubble-${item.providerId}`}
              checked={item.bubble}
              onCheckedChange={checked => onPropertyChange(item.providerId, 'bubble', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor={`panel-${item.providerId}`} className="cursor-pointer">
              面板显示
            </Label>
            <Switch
              id={`panel-${item.providerId}`}
              checked={item.panel}
              onCheckedChange={checked => onPropertyChange(item.providerId, 'panel', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
