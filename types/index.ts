export type Provider = SearchProvider | ActionProvider

type BaseProvider = {
  label: string
  icon: string
}

export type SearchProvider = BaseProvider &{
  type:'search'
  link: string
}

export type ActionPayload = {
    source: string
    selectedText: string
  }

export type ActionProvider = BaseProvider &{
  type:'action'
  action: string
  payload: boolean
}
