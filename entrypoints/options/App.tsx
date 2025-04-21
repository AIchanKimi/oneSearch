import type { ActionProvider } from '@/types'
import type { DropResult } from '@hello-pangea/dnd'
import { ActionProviderCard } from '@/components/ActionProviderCard'
import { ActionProviderEditDialog } from '@/components/ActionProviderEditDialog'
import { SortableSheet } from '@/components/SortableSheet'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { ActionProviderStorage, GroupOrderStorage } from '@/utils/storage'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Check, ChevronsUpDown, MoveVertical } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type SortableActionProvider = {
  id: string
} & ActionProvider

type SortableTag = {
  id: string
  label: string
}

function App() {
  const [data, setData] = useState<ActionProvider[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ActionProvider | null>(null)
  const [parent] = useAutoAnimate()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
  const [displayFilter, setDisplayFilter] = useState<string>('all')

  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false)
  const [bubbleItemsForSort, setBubbleItemsForSort] = useState<SortableActionProvider[]>([])
  const [isGroupOrderSheetOpen, setIsGroupOrderSheetOpen] = useState(false)
  const [groupOrderTags, setGroupOrderTags] = useState<SortableTag[]>([])

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

  const handleOpenGroupSortSheet = async () => {
    const tags = Array.from(new Set(data.map(item => item.tag || '其他')))
    const stored = await GroupOrderStorage.getValue()
    const initial = [
      ...stored.filter(tag => tags.includes(tag)),
      ...tags.filter(tag => !stored.includes(tag)),
    ]
    setGroupOrderTags(initial.map(tag => ({ id: tag, label: tag })))
    setIsGroupOrderSheetOpen(true)
  }

  const handleGroupDragEnd = (result: DropResult) => {
    if (!result.destination)
      return
    const newTags = Array.from(groupOrderTags)
    const [moved] = newTags.splice(result.source.index, 1)
    newTags.splice(result.destination.index, 0, moved)
    setGroupOrderTags(newTags)
  }

  const handleSaveGroupOrder = async () => {
    await GroupOrderStorage.setValue(groupOrderTags.map(tag => tag.label))
    setIsGroupOrderSheetOpen(false)
    toast.success('分组排序已保存')
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

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingItem({ ...data[index] })
    setIsDialogOpen(true)
  }

  const handleDelete = async (index: number) => {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
    await ActionProviderStorage.setValue(newData)
    toast.success('项目已删除')
  }

  const handleAddNew = async () => {
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

  const handleCancelEdit = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setEditingIndex(null)
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

  const renderGroupTagItem = (item: SortableTag) => (
    <>{item.label}</>
  )

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="header-container py-4 mb-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="filter-controls flex flex-wrap items-center gap-4">
              <div>
                <Label htmlFor="search-term">搜索标签</Label>
                <Input
                  id="search-term"
                  placeholder="输入关键词搜索"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="mt-1 w-52"
                />
              </div>

              <div>
                <Label htmlFor="type-filter">按类型过滤</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter" className="mt-1 w-52">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="search">搜索</SelectItem>
                    <SelectItem value="menu">菜单</SelectItem>
                    <SelectItem value="copy">复制</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display-filter">显示过滤</Label>
                <Select value={displayFilter} onValueChange={setDisplayFilter}>
                  <SelectTrigger id="display-filter" className="mt-1 w-52">
                    <SelectValue placeholder="选择显示方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="bubble">气泡</SelectItem>
                    <SelectItem value="panel">面板</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tag-filter">按标签过滤</Label>
                <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tagPopoverOpen}
                      className="justify-between mt-1 w-52"
                    >
                      {tagFilter === 'all' ? '全部标签' : tagFilter}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 max-h-80 overflow-y-auto scrollbar-none">
                    <Command>
                      <CommandInput placeholder="搜索标签..." />
                      <CommandEmpty>未找到相关标签</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setTagFilter('all')
                            setTagPopoverOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              tagFilter === 'all' ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          全部标签
                        </CommandItem>
                        {availableTags.map(tag => (
                          <CommandItem
                            key={tag}
                            value={tag}
                            onSelect={() => {
                              setTagFilter(tag)
                              setTagPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                tagFilter === tag ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {tag}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="add-button-container md:self-end flex space-x-2">
              <Button onClick={handleOpenGroupSortSheet} variant="outline" className="flex items-center gap-2">
                <MoveVertical size={16} />
                排序分组
              </Button>
              <Button onClick={handleOpenSortSheet} variant="outline" className="flex items-center gap-2">
                <MoveVertical size={16} />
                排序气泡
              </Button>
              <Button onClick={handleAddNew} className="flex items-center gap-2 w-full md:w-auto">
                <span>+</span>
                {' '}
                添加新项
              </Button>
            </div>
          </div>
        </div>

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
                        onDelete={handleDelete}
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
      </main>

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

      <SortableSheet<SortableTag>
        open={isGroupOrderSheetOpen}
        onOpenChange={setIsGroupOrderSheetOpen}
        title="排序分组"
        description="拖拽调整分组显示顺序"
        items={groupOrderTags}
        onDragEnd={handleGroupDragEnd}
        onSave={handleSaveGroupOrder}
        renderItem={renderGroupTagItem}
      />

      <ActionProviderEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleDialogSave}
        onCancel={handleCancelEdit}
      />

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
