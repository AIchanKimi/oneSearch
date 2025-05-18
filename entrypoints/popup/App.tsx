import type { ActionProvider, FetchRemoteProvidersResponse, RemoteProvider } from '@/types'
import { RemoteProviderCard } from '@/components/RemoteProviderCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { convertRemoteToActionProvider } from '@/utils/convert-provider'
import { ActionProviderStorage } from '@/utils/storage'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useQuery } from '@tanstack/react-query'
import { Cog, Home } from 'lucide-react'
import psl from 'psl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// 为全局常量添加类型声明
declare const __APP_VERSION__: string

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [parent] = useAutoAnimate()

  // 获取当前活动标签页的URL
  useEffect(() => {
    const getCurrentTabUrl = async () => {
      // 使用Chrome API获取当前标签页
      const queryOptions = { active: true, lastFocusedWindow: true }
      const [tab] = await chrome.tabs.query(queryOptions)
      if (tab?.url) {
        try {
          const urlObj = new URL(tab.url)
          const hostname = urlObj.hostname

          const parsed = psl.parse(hostname)
          if (parsed.error || parsed.sld === null) {
            console.error('解析域名失败', parsed.error)
          }
          else {
            setSearchTerm(parsed.sld) // 确保传递的值为字符串
          }
        }
        catch (e) {
          console.error('获取页面域名失败', e)
        }
      }
    }

    getCurrentTabUrl()
  }, [])

  // 从API获取远程提供者
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['domainProviders', searchTerm],
    queryFn: async () => {
      if (!searchTerm)
        return { providers: [], hasMore: false }

      const apiUrl = `${import.meta.env.VITE_API_URL}/api/provider?keyword=${searchTerm}&pageSize=5`
      const response = await fetch(apiUrl)
      const result: FetchRemoteProvidersResponse = await response.json()

      if (result.code !== 0) {
        throw new Error('获取远程提供商失败')
      }

      return result.data
    },
    enabled: Boolean(searchTerm),
  })

  const [addedProviderIds, setAddedProviderIds] = useState<number[]>([])

  useEffect(() => {
    async function fetchLocalProviderIds() {
      const localProviders = await ActionProviderStorage.getValue()
      setAddedProviderIds(localProviders.map(item => item.providerId))
    }
    fetchLocalProviderIds()
  })

  // 处理提供者点击，存储到本地
  const handleSelectProvider = async (remoteProvider: RemoteProvider) => {
    const localProvider = convertRemoteToActionProvider(remoteProvider)
    try {
      // 存储到本地
      const storageData = await ActionProviderStorage.getValue()
      const newData: ActionProvider[] = [localProvider, ...storageData]
      await ActionProviderStorage.setValue(newData)

      // 调用use API增加使用计数
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/provider/${remoteProvider.providerId}/use`
        await fetch(apiUrl)

        // 刷新列表以显示最新数据
        if (searchTerm) {
          await refetch()
        }
      }
      catch (error) {
        console.error('增加使用计数失败', error)
        // 非关键错误，不影响用户操作，仅记录日志
      }

      toast.success('提供者已成功存储到本地')
    }
    catch (error) {
      console.error('存储提供者到本地失败', error)
      toast.error('存储失败，请重试')
    }
  }

  // 检查是否有搜索词，以决定UI布局
  const hasSearchTerm = Boolean(searchTerm)

  return (
    <div ref={parent} className="w-96 p-4 font-sans bg-white">
      {hasSearchTerm ? (
        // 紧凑布局 - 有搜索词时
        <>
          <header className="flex justify-between items-center mb-2">
            <h1 className="m-0 text-lg text-gray-800">OneSearch</h1>
            <div className="text-xs text-gray-400">
              v
              {__APP_VERSION__}
            </div>
          </header>

          <div className="flex flex-col justify-between gap-2 min-h-60">
            <Input
              placeholder="搜索域名或名称"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />

            {isLoading
              ? (
                  <div className="text-center py-3">加载中...</div>
                )
              : isError
                ? (
                    <div className="text-center py-3">获取数据失败</div>
                  )
                : data?.providers && data.providers.length > 0
                  ? (
                      <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto scrollbar-none">
                        {data.providers.map(provider => (
                          <RemoteProviderCard
                            key={provider.providerId}
                            provider={provider}
                            onSelect={handleSelectProvider}
                            isAdded={addedProviderIds.includes(provider.providerId)}
                          />
                        ))}
                      </div>
                    )
                  : (
                      <div className="text-center py-3">没有找到相关结果</div>
                    )}

            <div className="flex gap-2 mt-1">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href="options.html" target="_blank">
                  <Cog className="h-4 w-4 mr-1" />
                  {' '}
                  设置
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a
                  href="https://github.com/AIchanKimi/oneSearch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Home className="h-4 w-4 mr-1" />
                  {' '}
                  主页
                </a>
              </Button>
            </div>
          </div>
        </>
      ) : (
        // 常规布局 - 无搜索结果时
        <>
          <header className="text-center mb-4 border-b border-gray-200 pb-3">
            <h1 className="m-0 text-xl text-gray-800">OneSearch</h1>
            <p className="mt-2 text-sm text-gray-500">一键搜索多个平台</p>
          </header>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="搜索域名"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />

            {isLoading
              ? (
                  <div className="text-center py-4">加载中...</div>
                )
              : isError
                ? (
                    <div className="text-center py-4">获取数据失败</div>
                  )
                : searchTerm
                  ? (
                      <div className="text-center py-4">没有找到相关结果</div>
                    )
                  : null}

            <div className="flex flex-col gap-3 mt-2">
              <Button asChild variant="outline" size="default">
                <a href="options.html" target="_blank" className="w-full">
                  打开设置
                </a>
              </Button>
              <Button asChild variant="outline" size="default">
                <a
                  href="https://github.com/AIchanKimi/oneSearch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  项目主页
                </a>
              </Button>
            </div>
          </div>

          <footer className="text-center text-xs text-gray-400 mt-4 border-t border-gray-200 pt-3">
            <p className="m-0">
              v
              {__APP_VERSION__}
            </p>
          </footer>
        </>
      )}

      <Toaster richColors position="top-right" expand closeButton />
    </div>
  )
}

export default App
