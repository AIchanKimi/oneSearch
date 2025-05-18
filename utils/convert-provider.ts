import type { ActionProvider, RemoteProvider } from '@/types'

/**
 * 将远程 RemoteProvider 转换为本地 ActionProvider 格式
 */
export function convertRemoteToActionProvider(remoteProvider: RemoteProvider, bubble: boolean = false, panel: boolean = false): ActionProvider {
  return {
    providerId: remoteProvider.providerId,
    label: remoteProvider.label,
    homepage: remoteProvider.homepage,
    icon: remoteProvider.icon,
    tag: remoteProvider.tag,
    bubble,
    panel,
    type: 'search',
    payload: {
      link: remoteProvider.link,
      selectedText: '',
      source: '',
    },
  }
}
