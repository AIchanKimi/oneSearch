export type UIAction = {
  type: 'show' | 'hide' | 'replace' | 'toggle' | 'close'
  target: string // 'panel' | 'bubble' | 'iframe' | 'dialog' | 'current'
  source?: string // 当前要关闭的 UI（用于 replace 类型）
}

export type UIConfig<T extends string = string> = {
  key: T
  state: {
    isVisible: boolean
    isPinned: boolean
  }
  actions: {
    show: () => void
    hide: () => void
    toggle: () => void
  }
}

export type ActionResult = {
  success: boolean
  error?: string
  uiAction?: UIAction // UI 动作指令
}

export type CopyActionInput = {
  selectedText: string
}

export type SearchActionInput = {
  link: string
  selectedText: string
}

export type MenuActionInput = Record<string, never> // menu类型不需要额外参数

export type ActionInput = CopyActionInput | SearchActionInput | MenuActionInput

export type ActionExecutor<T extends ActionInput> = {
  execute: (input: T) => Promise<ActionResult>
}

export type ActionContext = {
  source: string
  timestamp: number
}
