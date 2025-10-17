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

// UI 设置配置
export type UISettings = {
  theme: 'light' | 'dark' | 'system'
  bubble: {
    defaultVisible: boolean
    defaultPosition: { x: number, y: number }
    offset: { x: number, y: number }
  }
  panel: {
    defaultVisible: boolean
    defaultPinned: boolean
    defaultPosition: { x: number, y: number }
  }
}

// UI 设置存储
export const UISettingsStorage = storage.defineItem<UISettings>(
  'local:UISettingsStorage',
  {
    fallback: {
      theme: 'system',
      bubble: {
        defaultVisible: true,
        defaultPosition: { x: 0, y: 0 },
        offset: { x: 20, y: 20 },
      },
      panel: {
        defaultVisible: false,
        defaultPinned: false,
        defaultPosition: { x: 0, y: 0 },
      },
    },
  },
)
