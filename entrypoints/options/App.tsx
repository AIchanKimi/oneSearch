import type { ActionProvider } from '@/types'
import { ActionProviderCard } from '@/components/ActionProviderCard'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { Switch } from '@/components/ui/switch'
import { ActionProviderStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function App() {
  const [data, setData] = useState<ActionProvider[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActionProvider | null>(null)

  useEffect(() => {
    async function fetchData() {
      const storageData = await ActionProviderStorage.getValue()
      setData(storageData)
    }
    fetchData()
  }, [])

  // 处理编辑状态
  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingItem({ ...data[index] })
    setIsDialogOpen(true)
  }

  // 处理删除项目
  const handleDelete = (index: number) => {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
  }

  // 处理添加新项
  const handleAddNew = () => {
    const newItem: ActionProvider = {
      label: '新项目',
      bubble: false,
      panel: false,
      type: 'search',
      icon: '',
      tag: '',
      payload: {
        link: '',
        selectedText: '',
        source: '',
      },
    }
    setData([...data, newItem])
  }

  // 直接更新单个属性
  const handlePropertyChange = async (index: number, property: keyof ActionProvider, value: any) => {
    const newData = [...data]
    newData[index] = {
      ...newData[index],
      [property]: value,
    }
    setData(newData)

    // 直接保存到存储
    await ActionProviderStorage.setValue(newData)
  }

  // 处理对话框中的数据更新
  const handleDialogDataChange = <K extends keyof ActionProvider>(field: K, value: ActionProvider[K]) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [field]: value,
      })
    }
  }

  // 保存对话框编辑
  const handleDialogSave = () => {
    if (editingIndex !== null && editingItem) {
      const newData = [...data]
      newData[editingIndex] = editingItem
      setData(newData)
      setIsDialogOpen(false)
      setEditingItem(null)
      setEditingIndex(null)
    }
  }

  // 保存所有更改
  const handleSave = async () => {
    await ActionProviderStorage.setValue(data)
    toast.success('数据已成功保存！')
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setEditingIndex(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">One Search 选项</h1>
          <p className="bg-slate-100 px-3 py-1 rounded-lg">
            数据长度:
            {data.length}
          </p>
        </div>
      </header>
      <main className="flex-1">
        <div className="storage-content">
          <h2 className="text-xl font-semibold mb-4">存储内容：</h2>
          {data.length > 0
            && (
              <div className="data-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item, index) => (
                  <ActionProviderCard
                    key={item.label || index}
                    item={item}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPropertyChange={handlePropertyChange}
                  />
                ))}
              </div>
            ) }
        </div>
        <div className="button-container mt-6 flex justify-between items-center">
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <span>+</span>
            {' '}
            添加新项
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <span>💾</span>
            {' '}
            保存更改
          </Button>
        </div>
      </main>

      {/* 编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Input
                  id="edit-tag"
                  value={editingItem.tag}
                  className="mt-1"
                  onChange={e => handleDialogDataChange('tag', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="edit-icon">图标URL</Label>
                <Input
                  id="edit-icon"
                  value={editingItem.icon}
                  className="mt-1"
                  onChange={e => handleDialogDataChange('icon', e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              取消
            </Button>
            <Button onClick={handleDialogSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
