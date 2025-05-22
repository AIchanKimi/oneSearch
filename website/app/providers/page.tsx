'use client'

// 从types目录导入类型
import type { FetchRemoteProvidersResponse, RemoteProvider } from '../../../types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { useDebounce, useIntersection } from 'react-use'

// 定义请求参数类型
type FetchProvidersParams = {
  pageParam?: number
  keyword: string
  tag: string
}

export default function ProvidersPage() {
  const [filters, setFilters] = useState({ keyword: '', tag: '' })
  const [debouncedFilters, setDebouncedFilters] = useState({ keyword: '', tag: '' })

  // 用于无限滚动的引用
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // 使用useDebounce减少搜索请求频率
  useDebounce(
    () => setDebouncedFilters(filters),
    500,
    [filters],
  )

  // 使用useIntersection监测底部元素是否可见，用于实现无限滚动
  const intersection = useIntersection(loadMoreRef as React.RefObject<HTMLElement>, {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
  })

  // 获取远程提供商数据的查询函数
  const fetchProviders = async ({ pageParam = 1, keyword, tag }: FetchProvidersParams) => {
    const apiUrl = `/api/provider?page=${pageParam}&pageSize=10&keyword=${encodeURIComponent(keyword)}&tag=${encodeURIComponent(tag === 'all' ? '' : tag)}`

    const response = await fetch(apiUrl)
    const result: FetchRemoteProvidersResponse = await response.json()

    if (result.code !== 0) {
      throw new Error('获取远程提供商失败')
    }

    return result.data
  }

  // 使用 useInfiniteQuery 获取数据
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['providers', debouncedFilters.keyword, debouncedFilters.tag],
    queryFn: ({ pageParam }) => fetchProviders({
      pageParam,
      keyword: debouncedFilters.keyword,
      tag: debouncedFilters.tag,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.length + 1 : undefined,
  })

  // 优化 intersection 的依赖项，只在必要时触发加载
  const isIntersecting = intersection?.isIntersecting
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage])

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 无需手动刷新，useInfiniteQuery会在keyword改变时自动刷新
  }

  // 过滤器变化时重新加载
  const handleFilterChange = (key: 'keyword' | 'tag', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // 标签筛选
  const handleTagClick = (tag: string) => {
    handleFilterChange('tag', filters.tag === tag ? '' : tag)
  }

  // 将所有页面的提供商合并为一个数组
  const allProviders = data?.pages.flatMap(page => page.providers) || []

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">搜索提供商</h1>

      {/* 搜索和过滤控制 */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              placeholder="搜索提供商..."
              value={filters.keyword}
              onChange={e => handleFilterChange('keyword', e.target.value)}
              className="flex-1"
            />
            <Button type="submit">搜索</Button>
          </div>
        </form>

        {/* 标签过滤 */}
        <div>
          <h2 className="text-lg font-medium mb-2">按标签筛选：</h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(allProviders.map(p => p.tag).filter(Boolean))].map(tag => (
              <Badge
                key={tag}
                variant={filters.tag === tag ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error instanceof Error ? error.message : '获取数据失败，请稍后重试'}
        </div>
      )}

      {/* 提供商列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allProviders.length > 0
          ? allProviders.map((provider: RemoteProvider) => (
              <div key={provider.providerId} className="relative flex flex-col justify-between border rounded-md p-4 h-56 bg-white hover:shadow-lg transition-shadow duration-200">
                {provider.tag && (
                  <div className="absolute top-2 right-2 text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">{provider.tag}</div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <Image src={provider.icon} alt={provider.label} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-lg truncate">{provider.label}</div>
                    <div className="text-sm text-gray-500 truncate">
                      <a href={provider.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {provider.homepage}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2 break-all overflow-hidden line-clamp-2">{provider.link}</div>
                <div className="flex items-center justify-between mt-auto mb-2">
                  <div className="text-xs text-gray-600 flex gap-4 items-center">
                    <div className="flex items-center gap-1">
                      <ArrowBigUp className="w-4 h-4 text-gray-500" />
                      <span>{provider.usageCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowBigDown className="w-4 h-4 text-gray-500" />
                      <span>{provider.obsoleteCount ?? 0}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 bottom-4"
                    onClick={() => window.open(provider.link.replace('{selectedText}', 'example'), '_blank')}
                  >
                    预览
                  </Button>
                </div>
              </div>
            ))
          : !isLoading && (
              <div className="text-center py-12 text-gray-500 col-span-full">
                未找到匹配的提供商
              </div>
            )}
      </div>

      {/* 加载提示和无限滚动触发器 */}
      {(isLoading || isFetchingNextPage) && (
        <div className="text-center py-4 mt-4">
          <Loader2 className="inline-block w-6 h-6 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      )}

      {/* 无限滚动触发元素 */}
      <div ref={loadMoreRef} className="h-1 mt-4" />
    </div>
  )
}
