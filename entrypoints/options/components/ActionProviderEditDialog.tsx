import type { ActionProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ProviderTagEnum } from '@/types'
import { Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type ActionProviderEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ActionProvider | null
  onSave: (item: ActionProvider) => void
  onCancel: () => void
  onDelete: (item: ActionProvider) => void
  onUpload: () => void
}

export function ActionProviderEditDialog({
  open,
  onOpenChange,
  item: initialItem,
  onSave,
  onCancel,
  onDelete,
  onUpload,
}: ActionProviderEditDialogProps) {
  const [editingItem, setEditingItem] = useState<ActionProvider | null>(null)
  const [customTagInput, setCustomTagInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)

  // 当初始item改变时更新内部状态
  useEffect(() => {
    if (initialItem) {
      setEditingItem({ ...initialItem })
      setCustomTagInput('')
    }
  }, [initialItem])

  // 处理对话框中的数据更新
  const handleDialogDataChange = (field: string, value: any) => {
    if (!editingItem)
      return

    setEditingItem((prev) => {
      if (!prev)
        return prev

      // 处理嵌套属性，如 payload.link
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent as keyof ActionProvider]: {
            ...(prev[parent as keyof ActionProvider] as object),
            [child]: value,
          },
        }
      }

      // 处理普通属性
      if (field === 'tag') {
        if (value === 'custom') {
          setCustomTagInput('')
          return { ...prev, tag: '' }
        }
        else {
          setCustomTagInput('')
          return { ...prev, tag: value }
        }
      }

      return {
        ...prev,
        [field]: value,
      }
    })
  }

  // 处理图片上传并转换为base64
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file)
      return

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      if (base64String) {
        handleDialogDataChange('icon', base64String)
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSave = () => {
    if (editingItem) {
      let itemToSave = { ...editingItem }
      // 判断是否为自定义标签（tag不是枚举值）
      if (!(Object.values(ProviderTagEnum) as string[]).includes(editingItem.tag)) {
        itemToSave = { ...itemToSave, tag: customTagInput as any }
      }
      onSave(itemToSave as ActionProvider)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑项目</DialogTitle>
        </DialogHeader>
        {editingItem && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-label">标签</Label>
              <Input
                id="edit-label"
                value={editingItem.label || ''}
                className="mt-1"
                onChange={e => handleDialogDataChange('label', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-homepage">主页</Label>
              <Input
                id="edit-homepage"
                value={editingItem.homepage || ''}
                className="mt-1"
                onChange={e => handleDialogDataChange('homepage', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-bubble">气泡显示</Label>
              <Switch
                id="edit-bubble"
                checked={editingItem.bubble}
                onCheckedChange={checked => handleDialogDataChange('bubble', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-panel">面板显示</Label>
              <Switch
                id="edit-panel"
                checked={editingItem.panel}
                onCheckedChange={checked => handleDialogDataChange('panel', checked)}
              />
            </div>

            <div>
              <Label htmlFor="edit-type">类型</Label>
              <Select
                value={editingItem.type}
                onValueChange={value => handleDialogDataChange('type', value as ActionProvider['type'])}
              >
                <SelectTrigger id="edit-type" className="mt-1">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="search">搜索</SelectItem>
                  <SelectItem value="menu">菜单</SelectItem>
                  <SelectItem value="copy">复制</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-tag">标签分类</Label>
              <Select
                value={Object.keys(ProviderTagEnum).includes(editingItem.tag) ? editingItem.tag : 'custom'}
                onValueChange={value => handleDialogDataChange('tag', value)}
              >
                <SelectTrigger id="edit-tag" className="mt-1">
                  <SelectValue placeholder="选择标签分类" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ProviderTagEnum).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
              {(!Object.keys(ProviderTagEnum).includes(editingItem.tag)) && (
                <Input
                  id="edit-tag-custom"
                  className="mt-2"
                  placeholder="请输入自定义标签"
                  value={customTagInput}
                  onChange={e => setCustomTagInput(e.target.value)}
                />
              )}
            </div>

            <div>
              <Label htmlFor="edit-icon">图标URL</Label>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-10 h-10 border rounded flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={triggerFileInput}
                  title="点击上传图片"
                >
                  {editingItem.icon
                    ? (
                        <img
                          src={editingItem.icon}
                          alt="预览"
                          className="h-full w-full object-contain"
                        />
                      )
                    : (
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      )}
                </div>
                <Input
                  id="edit-icon"
                  value={editingItem.icon}
                  className="flex-1"
                  onChange={e => handleDialogDataChange('icon', e.target.value)}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* 只有搜索类型才显示payload配置 */}
            {editingItem.type === 'search' && (
              <div className="space-y-2 border-t pt-2 mt-2">
                <h4 className="font-medium">Payload 配置</h4>

                <div>
                  <Label htmlFor="edit-link">链接模板</Label>
                  <Input
                    id="edit-link"
                    value={(editingItem.payload as any).link || ''}
                    className="mt-1"
                    onChange={e => handleDialogDataChange('payload.link', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    搜索关键词用
                    {' '}
                    {'{selectedText}'}
                    {' '}
                    替换，例子https://www.bing.com/search?q=
                    {'{selectedText}'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row-reverse sm:flex-row sm:justify-between w-full">
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (clickTimer.current)
                      clearTimeout(clickTimer.current)
                    clickTimer.current = setTimeout(() => {
                      toast.error('双击删除')
                    }, 250)
                  }}
                  onDoubleClick={() => {
                    if (clickTimer.current)
                      clearTimeout(clickTimer.current)
                    if (editingItem)
                      onDelete(editingItem)
                  }}
                >
                  删除
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSave()
                    onUpload()
                  }}
                >
                  上传
                </Button>

              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  取消
                </Button>
                <Button onClick={handleSave}>保存</Button>
              </div>

            </div>
            <p className="text-sm text-muted-foreground mt-1">
              删除按钮仅限于本地删除，上传的数据无法被删除。
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
