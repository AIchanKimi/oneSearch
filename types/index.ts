export type BaseProvider = {
  label: string
  icon: string
  tag: string
  bubble: boolean
  panel: boolean
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
