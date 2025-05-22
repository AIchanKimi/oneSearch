export enum ProviderTagEnum {
  general = '通用',
  translation = '翻译',
  cloud = '网盘',
  knowledge = '知识',
  map = '地图',
  image = '图片',
  social = '社交',
  news = '新闻',
  technology = '技术',
  shopping = '购物',
  music = '音乐',
  video = '视频',
  other = '其他',
}

export type ProviderTag = keyof typeof ProviderTagEnum

export type BaseProvider = {
  providerId: number
  label: string
  homepage: string
  icon: string
  tag: ProviderTag
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
  tag: ProviderTag
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
  message: string
}
