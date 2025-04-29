import type { ActionProvider } from '@/types'

export const ActionProviderStorage = storage.defineItem<ActionProvider[]>(
  'local:ActionProviderStorage',
  {
    fallback: [],
  },
)

export const GroupOrderStorage = storage.defineItem<string[]>(
  'local:GroupOrderStorage',
  {
    fallback: [],
  },
)

// 气泡偏移值配置
export const BubbleOffsetStorage = storage.defineItem<{ x: number, y: number }>(
  'local:BubbleOffsetStorage',
  {
    fallback: { x: 20, y: 20 }, // 默认偏移值
  },
)
