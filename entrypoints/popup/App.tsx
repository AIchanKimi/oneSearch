import type { ActionProvider, FetchRemoteProvidersResponse, RemoteProvider } from '@/types'
import { RemoteProviderCard } from '@/components/RemoteProviderCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ActionProviderStorage } from '@/utils/storage'
import { useQuery } from '@tanstack/react-query'
import psl from 'psl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// 为全局常量添加类型声明
declare const __APP_VERSION__: string

function App() {
  const [searchTerm, setSearchTerm] = useState('')

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
  const { data, isLoading, isError } = useQuery({
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

  // 处理提供者点击，存储到本地
  const handleSelectProvider = async (remoteProvider: RemoteProvider) => {
    const localProvider: ActionProvider = {
      providerId: remoteProvider.providerId,
      label: remoteProvider.label,
      homepage: remoteProvider.homepage,
      bubble: true,
      panel: true,
      type: 'search', // 确保类型与 ActionProvider 定义一致
      icon: remoteProvider.icon,
      tag: remoteProvider.tag,
      payload: {
        link: remoteProvider.link,
        selectedText: '',
        source: '',
      },
    }

    try {
      // 存储到本地
      const storageData = await ActionProviderStorage.getValue()
      const newData: ActionProvider[] = [localProvider, ...storageData]
      await ActionProviderStorage.setValue(newData)
      toast.success('提供者已成功存储到本地')
    }
    catch (error) {
      console.error('存储提供者到本地失败', error)
      toast.error('存储失败，请重试')
    }
  }

  return (
    <div className="w-96 p-4 font-sans bg-white">
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
            : data?.providers && data.providers.length > 0
              ? (
                  <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                    {data.providers.map(provider => (
                      <RemoteProviderCard
                        key={provider.providerId}
                        provider={provider}
                        onSelect={handleSelectProvider}
                      />
                    ))}
                  </div>
                )
              : searchTerm
                ? (
                    <div className="text-center py-4">没有找到相关结果</div>
                  )
                : null}

        <div className="flex flex-col gap-3 mt-2">
          <Button asChild variant="default" size="default">
            <a
              href="options.html"
              target="_blank"
              className="w-full"
            >
              打开设置
            </a>
          </Button>
          <Button asChild variant="default" size="default">
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
    </div>
  )
}

export default App
