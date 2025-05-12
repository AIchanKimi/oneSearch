import type { ActionProvider, FetchRemoteProvidersResponse, RemoteProvider } from '@/types'
import { RemoteProviderCard } from '@/components/RemoteProviderCard'

// Adjust import order
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

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

  const handleCreateEmpty = async () => {
    if (onCreateEmpty) {
      await onCreateEmpty()
      onOpenChange(false) // 关闭对话框
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-4/5 sm:max-w-4/5 flex flex-col">
        <div className="flex gap-4 mb-4 mr-4 items-center">
          <Input
            placeholder="搜索关键词"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="输入标签"
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="w-40"
          />
          {onCreateEmpty && (
            <Button variant="secondary" onClick={handleCreateEmpty}>
              创建空白项
            </Button>
          )}
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {remoteProviders.length > 0
            ? (
                <>
                  {remoteProviders.map(provider => (
                    <RemoteProviderCard
                      key={provider.id}
                      provider={provider}
                      onSelect={handleSelectProvider}
                    />
                  ))}
                </>
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
