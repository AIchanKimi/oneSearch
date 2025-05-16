import type { ActionProvider, FetchRemoteProvidersResponse, RemoteProvider } from '@/types'
import { RemoteProviderCard } from '@/components/RemoteProviderCard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { convertRemoteToActionProvider } from '@/utils/convert-provider'
import { ActionProviderStorage } from '@/utils/storage'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce, useIntersection } from 'react-use'
import { toast } from 'sonner'

type RemoteProviderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProvider: (provider: ActionProvider) => Promise<void>
  onCreateEmpty?: () => Promise<void>
}

// 定义请求参数类型
type FetchProvidersParams = {
  pageParam?: number
  keyword: string
  tag: string
}

export function RemoteProviderDialog({ open, onOpenChange, onAddProvider, onCreateEmpty }: RemoteProviderDialogProps) {
  // 将 keyword 和 tag 整合成一个数组共用逻辑
  const [filters, setFilters] = useState({ keyword: '', tag: '' })
  const [debouncedFilters, setDebouncedFilters] = useState({ keyword: '', tag: '' })
  const [emptyBtnDisabled, setEmptyBtnDisabled] = useState(false)

  const [containerRef] = useAutoAnimate()
  useDebounce(
    () => setDebouncedFilters(filters),
    500,
    [filters],
  )

  // 底部加载参考元素和滚动容器
  // const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // 使用useIntersection监测底部元素是否可见，用于实现无限滚动
  const intersection = useIntersection(loadMoreRef as React.RefObject<HTMLElement>, {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
  })

  // 获取远程提供商数据的查询函数
  const fetchProviders = useCallback(async ({ pageParam = 1, keyword, tag }: FetchProvidersParams) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/provider?page=${pageParam}&pageSize=10&keyword=${keyword}&tag=${tag === 'all' ? '' : tag}`
    const response = await fetch(apiUrl)
    const result: FetchRemoteProvidersResponse = await response.json()

    if (result.code !== 0) {
      throw new Error('获取远程提供商失败')
    }

    return result.data
  }, [])

  // 使用 useInfiniteQuery 获取数据
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['remoteProviders', debouncedFilters.keyword, debouncedFilters.tag],
    queryFn: ({ pageParam }) => fetchProviders({
      pageParam,
      keyword: debouncedFilters.keyword,
      tag: debouncedFilters.tag,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: open, // 只在对话框打开时启用查询
  })

  // 当对话框打开时重置状态
  useEffect(() => {
    if (open) {
      // 重置过滤器
      setFilters({ keyword: '', tag: '' })
      setDebouncedFilters({ keyword: '', tag: '' })
      refetch()
    }
  }, [open, refetch])

  // 优化 intersection 的依赖项，只在必要时触发加载
  const isIntersecting = intersection?.isIntersecting
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage])

  const [addedProviderIds, setAddedProviderIds] = useState<number[]>([])

  useEffect(() => {
    async function fetchLocalProviderIds() {
      const localProviders = await ActionProviderStorage.getValue()
      setAddedProviderIds(localProviders.map(item => item.providerId))
    }
    fetchLocalProviderIds()
  }, [open])

  const handleSelectProvider = useCallback(async (remoteProvider: RemoteProvider) => {
    const localProvider = convertRemoteToActionProvider(remoteProvider)

    try {
      await onAddProvider(localProvider)
      toast.success('已添加到本地提供商')
      setAddedProviderIds(prev => [...prev, remoteProvider.providerId])
    }
    catch {
      toast.error('添加提供商失败')
    }
  }, [onAddProvider])

  const handleCreateEmpty = useCallback(async () => {
    if (!onCreateEmpty || emptyBtnDisabled)
      return
    setEmptyBtnDisabled(true)
    try {
      await onCreateEmpty()
      onOpenChange(false) // 关闭对话框
    }
    finally {
      setEmptyBtnDisabled(false)
    }
  }, [onCreateEmpty, onOpenChange, emptyBtnDisabled])

  // 将所有页面的提供商合并为一个数组
  const allProviders = useMemo(() =>
    data?.pages.flatMap(page => page.providers) || [], [data?.pages])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-4/5 sm:max-w-4/5 flex flex-col">
        <div className="mb-4">
          <DialogTitle>添加远程服务商</DialogTitle>
        </div>
        <div className="flex gap-4 mb-4 mr-8 items-center">
          <Input
            placeholder="搜索关键词"
            value={filters.keyword}
            onChange={e => setFilters({ ...filters, keyword: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="输入标签"
            value={filters.tag}
            onChange={e => setFilters({ ...filters, tag: e.target.value })}
            className="w-40"
          />
          {onCreateEmpty && (
            <Button variant="secondary" onClick={handleCreateEmpty} disabled={emptyBtnDisabled}>
              创建空白项
            </Button>
          )}
        </div>

        <div ref={containerRef} className="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scrollbar-none">
          {allProviders.length > 0
            ? (
                <>
                  {allProviders.map(provider => (
                    <RemoteProviderCard
                      key={provider.providerId}
                      provider={provider}
                      onSelect={handleSelectProvider}
                      isAdded={addedProviderIds.includes(provider.providerId)} // 判断是否已添加
                    />
                  ))}
                </>
              )
            : isLoading
              ? (
                  <div className="text-center py-4">加载中...</div>
                )
              : isError
                ? (
                    <div className="text-center py-4">获取数据出错，请重试</div>
                  )
                : (
                    <div className="text-center py-4">没有可用的远程提供商</div>
                  )}

          {isFetchingNextPage && (
            <div className="text-center py-4 col-span-full">加载中...</div>
          )}
          {/* 底部加载触发元素 */}
          <div ref={loadMoreRef} className="h-1" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
