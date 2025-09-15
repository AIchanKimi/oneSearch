import type { ActionProvider, ProviderTag } from '@/types'

export const ActionProviderStorage = storage.defineItem<ActionProvider[]>(
  'local:ActionProviderStorage',
  {
    fallback: [],
  },
)

export const GroupOrderStorage = storage.defineItem<ProviderTag[]>(
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

// 面板固定状态配置 - 控制点击后面板是否保持打开
export const PanelPinStorage = storage.defineItem<boolean>(
  'local:PanelPinStorage',
  {
    fallback: false, // 默认不固定，点击后关闭
  },
)

// 气泡固定状态配置 - 控制点击后气泡是否保持显示
export const BubblePinStorage = storage.defineItem<boolean>(
  'local:BubblePinStorage',
  {
    fallback: false, // 默认不固定，点击后关闭
  },
)

// 暗黑模式配置
export const DarkModeStorage = storage.defineItem<boolean>(
  'local:DarkModeStorage',
  {
    fallback: false, // 默认浅色模式
  },
)
