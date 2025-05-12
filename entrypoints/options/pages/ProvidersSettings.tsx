import type { ActionProvider } from '@/types'
import { ActionProviderCard } from '@/components/ActionProviderCard'
import { ActionProviderEditDialog } from '@/components/ActionProviderEditDialog'
import { RemoteProviderDialog } from '@/components/RemoteProviderDialog'
import { Toaster } from '@/components/ui/sonner'
import { ActionProviderStorage } from '@/utils/storage'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FilterHeader } from '../components/FilterHeader'
import { PageTitle } from '../components/PageTitle'

export function ProvidersSettings() {
  const [data, setData] = useState<ActionProvider[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
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

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingItem({ ...data[index] })
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

  const handlePropertyChange = async (index: number, property: keyof ActionProvider, value: any) => {
    const newData = [...data]
    newData[index] = {
      ...newData[index],
      [property]: value,
    }
    setData(newData)

    await ActionProviderStorage.setValue(newData)
    toast.success('已更新')
  }

  const handleDialogSave = async (updatedItem: ActionProvider) => {
    if (editingIndex !== null) {
      const newData = [...data]
      newData[editingIndex] = updatedItem
      setData(newData)
      await ActionProviderStorage.setValue(newData)
      toast.success('更改已保存')

      setIsDialogOpen(false)
      setEditingItem(null)
      setEditingIndex(null)
    }
  }

  const handleDialogDelete = async () => {
    if (editingIndex !== null) {
      const newData = [...data]
      newData.splice(editingIndex, 1) // 根据 editingIndex 删除项目
      setData(newData)
      await ActionProviderStorage.setValue(newData)
      toast.success('项目已删除')
      setIsDialogOpen(false)
      setEditingItem(null)
      setEditingIndex(null)
    }
  }

  const handleCancelEdit = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setEditingIndex(null)
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
                {filteredData.map((item) => {
                  const originalIndex = data.findIndex(d => d === item)
                  return (
                    <ActionProviderCard
                      key={`${item.label}-${item.type}-${originalIndex}`}
                      item={item}
                      index={originalIndex}
                      onEdit={handleEdit}
                      onPropertyChange={handlePropertyChange}
                    />
                  )
                })}
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
      />

      <RemoteProviderDialog
        open={isRemoteDialogOpen}
        onOpenChange={setIsRemoteDialogOpen}
        onAddProvider={handleAddProvider}
        onCreateEmpty={handleCreateEmpty}
      />

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default ProvidersSettings
