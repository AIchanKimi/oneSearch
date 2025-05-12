import type { ActionProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type RemoteProvider = {
  id: number
  label: string
  homepage: string
  icon: string
  tag: string
  link: string
  usageCount?: number
  obsoleteCount?: number
}

type FetchRemoteProvidersResponse = {
  code: number
  data: {
    providers: RemoteProvider[]
    hasMore: boolean
  }
}

type RemoteProviderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProvider: (provider: ActionProvider) => Promise<void>
  onCreateEmpty?: () => Promise<void>
}

export function RemoteProviderDialog({ open, onOpenChange, onAddProvider, onCreateEmpty }: RemoteProviderDialogProps) {
  const [remoteProviders, setRemoteProviders] = useState<RemoteProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [tag, setTag] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchRemoteProviders = useCallback(async () => {
    if (loading || !hasMore)
      return

    setLoading(true)
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/provider?page=${page}&pageSize=10&keyword=${keyword}&tag=${tag === 'all' ? '' : tag}`
      const response = await fetch(apiUrl)
      const result: FetchRemoteProvidersResponse = await response.json()

      if (result.code === 0 && result.data.providers) {
        setRemoteProviders(prev => [...prev, ...result.data.providers])
        setHasMore(result.data.hasMore)
        setPage(prev => prev + 1)
      }
      else {
        toast.error('获取远程提供商失败')
      }
    }
    catch (error) {
      console.error('获取远程提供商出错:', error)
      toast.error('获取远程提供商出错')
    }
    finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, keyword, tag])

  useEffect(() => {
    if (open) {
      fetchRemoteProviders()
    }
    else {
      setPage(1)
      setHasMore(true)
      setRemoteProviders([])
    }
  }, [open, fetchRemoteProviders])

  // 添加滚动监听
  useEffect(() => {
    const container = containerRef.current
    if (!container)
      return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      // 当滚动到距离底部100px时，加载更多
      if (scrollHeight - scrollTop - clientHeight < 100 && !loading && hasMore) {
        fetchRemoteProviders()
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [fetchRemoteProviders, loading, hasMore])

  const handleSelectProvider = async (remoteProvider: RemoteProvider) => {
    // 将远程提供商转换为本地ActionProvider格式
    const localProvider: ActionProvider = {
      label: remoteProvider.label,
      homepage: remoteProvider.homepage,
      bubble: true,
      panel: true,
      type: 'search',
      icon: remoteProvider.icon,
      tag: remoteProvider.tag,
      payload: {
        link: remoteProvider.link,
        selectedText: '{selectedText}',
        source: '',
      },
    }

    try {
      await onAddProvider(localProvider)
      toast.success('已添加到本地提供商')
    }
    catch {
      toast.error('添加提供商失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-4/5 sm:max-w-4/5">
        <DialogHeader>
          <DialogTitle>从远程库添加提供商</DialogTitle>
          <DialogDescription>
            选择一个提供商添加到您的本地设置中
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mb-4 items-center">
          <Input
            placeholder="搜索关键词"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择标签" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="tag1">标签1</SelectItem>
              <SelectItem value="tag2">标签2</SelectItem>
            </SelectContent>
          </Select>
          {onCreateEmpty && (
            <Button variant="secondary" onClick={onCreateEmpty}>
              创建空白提供商
            </Button>
          )}
        </div>

        <div ref={containerRef} className="max-h-[400px] overflow-y-auto">
          {remoteProviders.length > 0
            ? (
                <div className="space-y-2">
                  {remoteProviders.map(provider => (
                    <div key={provider.id} className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <div className="font-medium">{provider.label}</div>
                        <div className="text-sm text-gray-500">{provider.homepage}</div>
                        {provider.tag && (
                          <div className="text-xs mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{provider.tag}</div>
                        )}
                      </div>
                      <Button onClick={() => handleSelectProvider(provider)}>添加</Button>
                    </div>
                  ))}
                </div>
              )
            : loading && page === 1
              ? (
                  <div className="text-center py-4">加载中...</div>
                )
              : (
                  <div className="text-center py-4">没有可用的远程提供商</div>
                )}

          {loading && page > 1 && (
            <div className="text-center py-4">加载中...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
