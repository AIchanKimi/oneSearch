/* eslint-disable react-refresh/only-export-components */
import ReactDOM from 'react-dom/client'
import { createShadowRootUi } from 'wxt/client'
import App from './App.tsx'

export default defineContentScript({
  matches: ['*://*/*'],
  async main(ctx) {
    console.log('Hello content script.')

    const ui = await createShadowRootUi(ctx, {
      name: 'wxt-react-example',
      position: 'inline',
      anchor: 'body',
      append: 'first',
      onMount: (container) => {
        // Don't mount react app directly on <body>
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

    // 直接挂载UI，而不是等待消息
    ui.mount()
  },
})
