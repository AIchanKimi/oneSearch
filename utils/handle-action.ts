import type { ActionProvider } from '@/types'

export function handleAction(action: ActionProvider, menuAction: (arg?: any) => any, panelPinEnabled = false) {
  switch (action.type) {
    case 'menu':
      menuAction(true)
      break
    case 'copy':
      navigator.clipboard.writeText(action.payload.selectedText)
      window.getSelection()?.removeAllRanges()
      // 如果面板固定模式启用，则不关闭面板
      if (!panelPinEnabled) {
        menuAction(false)
      }
      break
    case 'search':
      window
        .open(action.payload.link.replaceAll('{selectedText}', encodeURI(action.payload.selectedText)), '_blank')
        ?.focus()
      window.getSelection()?.removeAllRanges()
      // 如果面板固定模式启用，则不关闭面板
      if (!panelPinEnabled) {
        menuAction(false)
      }
      break
    default:
      break
  }
}
