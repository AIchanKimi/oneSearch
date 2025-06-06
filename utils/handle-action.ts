import type { ActionProvider } from '@/types'

export function handleAction(action: ActionProvider, menuAction: (arg?: any) => any) {
  switch (action.type) {
    case 'menu':
      menuAction(true)
      break
    case 'copy':
      navigator.clipboard.writeText(action.payload.selectedText)
      window.getSelection()?.removeAllRanges()
      menuAction(false)
      break
    case 'search':
      window
        .open(action.payload.link.replaceAll('{selectedText}', encodeURI(action.payload.selectedText)), '_blank')
        ?.focus()
      window.getSelection()?.removeAllRanges()
      menuAction(false)
      break
    default:
      break
  }
}
