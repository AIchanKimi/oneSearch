import type { ActionProvider } from '@/types'

export function handleAction(action: ActionProvider) {
  switch (action.type) {
    case 'menu':
      break
    case 'copy':
      navigator.clipboard.writeText(action.payload.selectedText)
      window.getSelection()?.removeAllRanges()
      break
    case 'search':
      window
        .open(action.payload.link.replaceAll('{selectedText}', encodeURI(action.payload.selectedText)), '_blank')
        ?.focus()
      window.getSelection()?.removeAllRanges()
      break
    default:
      break
  }
}
