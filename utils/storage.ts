import type { ActionProvider } from '@/types'

export const ActionProviderStorage = storage.defineItem<ActionProvider[]>(
  'local:ActionProviderStorage',
  {
    fallback: [],
  },
)
