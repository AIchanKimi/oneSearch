import type { Theme } from './utils/theme-utils'
import ReactDOM from 'react-dom/client'
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'
import App from './App.tsx'
import { detectPageTheme } from './utils/theme-utils'
import '@/assets/globals.css'

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    // 在主环境中直接检测当前页面主题
    const currentTheme: Theme = detectPageTheme()

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

        // 直接传递检测到的主题给App组件
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
