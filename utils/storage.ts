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

// 搜索打开方式
export type SearchOpenMode = 'newTab' | 'currentTab' | 'incognitoWindow' | 'popupWindow'

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
  search: {
    openMode: SearchOpenMode // 搜索结果打开方式
    popupWindow?: {
      width: number
      height: number
      rememberPosition: boolean
      left?: number
      top?: number
    }
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
      search: {
        openMode: 'newTab', // 默认在新标签页打开
        popupWindow: {
          width: 800,
          height: 600,
          rememberPosition: true,
        },
      },
    },
  },
)
