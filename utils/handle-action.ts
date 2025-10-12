import type { ActionProvider } from '@/types'
import { PanelPinStorage } from './storage'

export async function handleAction(
  action: ActionProvider,
  menuAction: (arg?: any) => any,
  setPinnedAction?: (pinned: boolean) => void,
) {
  // 获取面板固定设置
  const keepPanelOpen = await PanelPinStorage.getValue()

  switch (action.type) {
    case 'menu':
      menuAction(true)
      break
    case 'copy':
      navigator.clipboard.writeText(action.payload.selectedText)
      // window.getSelection()?.removeAllRanges()
      // 设置固定状态
      if (setPinnedAction) {
        setPinnedAction(keepPanelOpen)
      }
      // 如果面板固定设置未开启，则关闭面板
      if (!keepPanelOpen) {
        menuAction(false)
      }
      break
    case 'search':
      window
        .open(action.payload.link.replaceAll('{selectedText}', encodeURI(action.payload.selectedText)), '_blank')
        ?.focus()
      // window.getSelection()?.removeAllRanges()
      // 设置固定状态
      if (setPinnedAction) {
        setPinnedAction(keepPanelOpen)
      }
      // 如果面板固定设置未开启，则关闭面板
      if (!keepPanelOpen) {
        menuAction(false)
      }
      break
    default:
      break
  }
}
