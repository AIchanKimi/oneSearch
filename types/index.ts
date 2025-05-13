export type BaseProvider = {
  label: string
  homepage: string
  icon: string
  tag: string
  bubble: boolean
  panel: boolean
  order?: number // 添加可选的排序属性
}

export type MenuAction = {
  type: 'menu'
  payload: {
    selectedText: string
    source: string
  }
}

export type SearchAction = {
  type: 'search'
  payload: {
    link: string
    selectedText: string
    source: string
  }
}

export type CopyAction = {
  type: 'copy'
  payload: {
    selectedText: string
    source: string
  }
}

export type ActionProvider = BaseProvider & (MenuAction | SearchAction | CopyAction)

export type ActionType = ActionProvider['type']

export type RemoteProvider = {
  providerId: number
  label: string
  homepage: string
  icon: string
  tag: string
  link: string
  usageCount: number
  obsoleteCount: number
}

export type FetchRemoteProvidersResponse = {
  code: number
  data: {
    providers: RemoteProvider[]
    hasMore: boolean
  }
}
