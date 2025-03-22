import type { ActionProvider } from '@/types'

export function handleAction(action: ActionProvider) {
  switch (action.type) {
    case 'menu':
      console.error('menu')
      break
    case 'copy':
      navigator.clipboard.writeText(action.payload.selectedText)
      break
    case 'search':
      const searchUrl = action.payload.link.replaceAll(
        '{selectedText}',
        encodeURI(action.payload.selectedText),
      )
      window
        .open(searchUrl, '_blank')
        ?.focus()
      break
    default:
      break
  }

  window.getSelection()?.removeAllRanges()
}
