import ReactDOM from 'react-dom/client'
import { createShadowRootUi } from 'wxt/client'
import App from './App.tsx'
import '@/assets/globals.css'

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'one-search',
      position: 'overlay',
      mode: 'closed',
      isolateEvents: true,
      anchor: 'body',
      append: 'last',
      zIndex: 9999,
      onMount: (container) => {
        const wrapper = document.createElement('div')
        container.append(wrapper)

        const root = ReactDOM.createRoot(wrapper)
        root.render(<App />)
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
