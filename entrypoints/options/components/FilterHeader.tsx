import type { Dispatch, SetStateAction } from 'react'
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
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

type FilterHeaderProps = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  typeFilter: string
  setTypeFilter: Dispatch<SetStateAction<string>>
  displayFilter: string
  setDisplayFilter: Dispatch<SetStateAction<string>>
  tagFilter: string
  setTagFilter: Dispatch<SetStateAction<string>>
  tagPopoverOpen: boolean
  setTagPopoverOpen: Dispatch<SetStateAction<boolean>>
  availableTags: string[]
  onAddNew: () => void
}

export function FilterHeader({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  displayFilter,
  setDisplayFilter,
  tagFilter,
  setTagFilter,
  tagPopoverOpen,
  setTagPopoverOpen,
  availableTags,
  onAddNew,
}: FilterHeaderProps) {
  return (
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
                        {convertProviderType(tag)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="add-button-container md:self-end">
          <Button onClick={onAddNew} className="flex items-center gap-2 w-full md:w-auto">
            <span>+</span>
            {' '}
            添加新项
          </Button>
        </div>
      </div>
    </div>
  )
}
