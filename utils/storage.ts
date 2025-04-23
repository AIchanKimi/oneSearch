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
