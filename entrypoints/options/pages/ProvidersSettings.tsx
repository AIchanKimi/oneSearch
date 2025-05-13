import type { ActionProvider } from '@/types'
import { ActionProviderCard } from '@/entrypoints/options/components/ActionProviderCard'
import { ActionProviderEditDialog } from '@/entrypoints/options/components/ActionProviderEditDialog'
import { RemoteProviderDialog } from '@/entrypoints/options/components/RemoteProviderDialog'
import { ActionProviderStorage } from '@/utils/storage'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FilterHeader } from '../components/FilterHeader'
import { PageTitle } from '../components/PageTitle'

export function ProvidersSettings() {
  const [data, setData] = useState<ActionProvider[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRemoteDialogOpen, setIsRemoteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActionProvider | null>(null)
  const [parent] = useAutoAnimate()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
  const [displayFilter, setDisplayFilter] = useState<string>('all')

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    data.forEach((item) => {
      if (item.tag)
        tags.add(item.tag)
    })
    return Array.from(tags)
  }, [data])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = !searchTerm
        || item.label.toLowerCase().includes(searchTerm.toLowerCase())
        || item.homepage.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || item.type === typeFilter

      const matchesTag = tagFilter === 'all' || item.tag === tagFilter

      const matchesDisplay = displayFilter === 'all'
        || (displayFilter === 'bubble' && item.bubble)
        || (displayFilter === 'panel' && item.panel)

      return matchesSearch && matchesType && matchesTag && matchesDisplay
    })
  }, [data, searchTerm, typeFilter, tagFilter, displayFilter])

  useEffect(() => {
    async function fetchData() {
      const storageData = await ActionProviderStorage.getValue()
      setData(storageData)
    }
    fetchData()
  }, [])

  const handleEdit = (providerId: number) => {
    const item = data.find(d => d.providerId === providerId)
    if (!item)
      return
    setEditingItem({ ...item })
    setIsDialogOpen(true)
  }

  const handleAddNew = async () => {
    // 打开远程提供商对话框
    setIsRemoteDialogOpen(true)
  }

  const handleAddProvider = async (provider: ActionProvider) => {
    const newData = [provider, ...data]
    setData(newData)
    await ActionProviderStorage.setValue(newData)
    return Promise.resolve()
  }

  const handleCreateEmpty = async () => {
    const newItem: ActionProvider = {
      providerId: Date.now(),
      label: '新项目',
      homepage: '',
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
    const newData = [newItem, ...data]
    setData(newData)
    await ActionProviderStorage.setValue(newData)
    toast.success('已添加新项目')
  }

  const handlePropertyChange = async (providerId: number, property: keyof ActionProvider, value: any) => {
    const newData = data.map(item =>
      item.providerId === providerId ? { ...item, [property]: value } : item,
    )
    setData(newData)
    await ActionProviderStorage.setValue(newData)
    toast.success('已更新')
  }

  const handleDialogSave = async (updatedItem: ActionProvider) => {
    const newData = data.map(item =>
      item.providerId === updatedItem.providerId ? updatedItem : item,
    )
    setData(newData)
    await ActionProviderStorage.setValue(newData)
    toast.success('更改已保存')
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const handleDialogDelete = async () => {
    if (!editingItem)
      return
    const newData = data.filter(item => item.providerId !== editingItem.providerId)
    setData(newData)
    await ActionProviderStorage.setValue(newData)
    toast.success('项目已删除')
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const handleCancelEdit = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }
  const handleUpload = async () => {
    if (!editingItem) {
      toast.error('没有可上传的项目')
      return
    }

    if (!('link' in editingItem.payload)) {
      toast.error('当前项目缺少必要的链接信息')
      return
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/provider`
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: editingItem.label,
          homepage: editingItem.homepage,
          icon: editingItem.icon,
          tag: editingItem.tag,
          link: editingItem.payload.link,
        }),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string }
        toast.error(`上传失败: ${errorData.message || '未知错误'}`)
        return
      }

      toast.success('上传成功')
    }
    catch (error) {
      console.error('上传时发生错误:', error)
      toast.error('上传失败: 网络错误')
    }
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="服务提供商管理"
        description="管理和配置搜索服务提供商"
      />

      <FilterHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        displayFilter={displayFilter}
        setDisplayFilter={setDisplayFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        tagPopoverOpen={tagPopoverOpen}
        setTagPopoverOpen={setTagPopoverOpen}
        availableTags={availableTags}
        onAddNew={handleAddNew}
      />

      <div className="storage-content">
        {filteredData.length > 0
          ? (
              <div ref={parent} className="data-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredData.map(item => (
                  <ActionProviderCard
                    key={item.providerId}
                    item={item}
                    onEdit={handleEdit}
                    onPropertyChange={handlePropertyChange}
                  />
                ))}
              </div>
            )
          : (
              <p className="text-center py-8 text-gray-500">
                没有符合条件的数据
              </p>
            )}
      </div>

      <ActionProviderEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleDialogSave}
        onCancel={handleCancelEdit}
        onDelete={handleDialogDelete}
        onUpload={handleUpload}
      />

      <RemoteProviderDialog
        open={isRemoteDialogOpen}
        onOpenChange={setIsRemoteDialogOpen}
        onAddProvider={handleAddProvider}
        onCreateEmpty={handleCreateEmpty}
      />

    </div>
  )
}

export default ProvidersSettings
