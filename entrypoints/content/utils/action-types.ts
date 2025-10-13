export type ActionResult = {
  success: boolean
  error?: string
  shouldCloseUI?: boolean
  shouldShowPanel?: boolean
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
