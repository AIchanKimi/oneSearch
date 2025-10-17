import type { Theme, ThemeSetting } from './utils/theme-utils'
import { UISettingsStorage } from '@/utils/storage'
import ReactDOM from 'react-dom/client'
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'
import App from './App.tsx'
import { getEffectiveTheme } from './utils/theme-utils'
import '@/assets/globals.css'

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    // 获取用户的主题设置
    const uiSettings = await UISettingsStorage.getValue()
    const themeSetting: ThemeSetting = uiSettings.theme

    // 根据用户设置获取实际主题
    const currentTheme: Theme = getEffectiveTheme(themeSetting)

    const ui = await createShadowRootUi(ctx, {
      name: 'one-search',
      position: 'overlay',
      mode: 'closed',
      isolateEvents: true,
      anchor: 'body',
      append: 'last',
      zIndex: 2147483646,
      onMount: (container) => {
        const wrapper = document.createElement('div')
        container.appendChild(wrapper)
        const root = ReactDOM.createRoot(wrapper)

        // 传递根据用户设置计算的主题给App组件
        root.render(<App theme={currentTheme} />)

        return { root, wrapper }
      },
      onRemove: (elements) => {
        elements?.root.unmount()
        elements?.wrapper.remove()
      },
    })

    ui.mount()
  },
})
