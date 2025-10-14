import type { ActionProvider } from '@/types'
import type { Theme } from './utils/theme-utils'
import Bubble from '@/components/bubble'
import Panel from '@/components/panel'
import { ActionProviderStorage, BubbleOffsetStorage } from '@/utils/storage'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useUIControl } from './hooks/useUIControl'
import { createActionHandler } from './utils/action-handler'

type ContextType = {
  selectedText: string
  setSelectedText: (_: string) => void
  mousePosition: { x: number, y: number }
  theme: Theme
}

export const Context = createContext<ContextType>({
  selectedText: '',
  setSelectedText: () => {},
  mousePosition: { x: 0, y: 0 },
  theme: 'light',
})

function Container() {
  const context = useContext(Context)
  const [bubbleItems, setBubbleItems] = useState<ActionProvider[]>([])
  const [panelItems, setPanelItems] = useState<ActionProvider[]>([])
  const { selectedText, mousePosition } = context

  // 使用两个独立的UI控制
  const [bubbleState, bubbleActions] = useUIControl({
    defaultVisible: true,
    defaultPosition: mousePosition,
    selectedText,
  })
  const [panelState, panelActions] = useUIControl({
    defaultVisible: false,
    defaultPosition: { x: 0, y: 0 },
    selectedText,
  })

  // 协调逻辑：显示panel时隐藏bubble
  const showPanel = useCallback(() => {
    bubbleActions.hide()
    panelActions.show()
  }, [bubbleActions, panelActions])

  // Action处理逻辑
  const actionHandler = createActionHandler()

  // 统一的action处理函数
  const handleMenuItemClick = useCallback(async (provider: ActionProvider, uiState: { isPinned: boolean, isVisible: boolean, actions: { hide: () => void } }) => {
    try {
      const result = await actionHandler.executeAction(provider)

      // 优先处理显示panel的逻辑
      if (result.effect?.shouldShowPanel) {
        showPanel()
        return // 提前返回，不执行后面的关闭逻辑
      }

      // 默认情况下，如果UI没有被固定，关闭UI并清除选中
      if (uiState.isVisible && !uiState.isPinned) {
        uiState.actions.hide()
        window.getSelection()?.removeAllRanges() // 只有在没有固定时才清除选中
      }

      // 处理错误情况
      if (!result.success && result.error) {
        console.error('Action failed:', result.error)
      }
    }
    catch (error) {
      console.error('Error executing action:', error)
    }
  }, [actionHandler, showPanel])

  useEffect(() => {
    async function fetchItems() {
      const items = await ActionProviderStorage.getValue()
      const tempList = items.map((item) => {
        item.payload.source = window.location.href
        item.payload.selectedText = selectedText
        return item
      })

      // 获取气泡项并按order排序
      const bubbleList = tempList.filter(item => item.bubble === true)
      const sortedBubbleList = bubbleList.sort((a, b) => {
        if (a.order === undefined && b.order === undefined)
          return 0
        if (a.order === undefined)
          return 1
        if (b.order === undefined)
          return -1
        return a.order - b.order
      })

      setBubbleItems(sortedBubbleList)
      setPanelItems(tempList.filter(item => item.panel === true))
    }

    fetchItems()
  }, [selectedText])

  return (
    <div onMouseDown={e => e.preventDefault()}>
      {/* Bubble组件 */}
      {bubbleState.isVisible && (
        <Bubble
          mousePosition={bubbleState.position}
          items={bubbleItems}
          isPinned={bubbleState.isPinned}
          onTogglePin={bubbleActions.togglePin}
          onPositionChange={bubbleActions.setPosition}
          onMenuItemClick={provider => handleMenuItemClick(provider, {
            isPinned: bubbleState.isPinned,
            isVisible: bubbleState.isVisible,
            actions: { hide: bubbleActions.hide },
          })}
        />
      )}

      {/* Panel组件 */}
      {panelState.isVisible && (
        <Panel
          items={panelItems}
          isPinned={panelState.isPinned}
          onClose={panelActions.hide}
          onTogglePin={panelActions.togglePin}
          onMenuItemClick={provider => handleMenuItemClick(provider, {
            isPinned: panelState.isPinned,
            isVisible: panelState.isVisible,
            actions: { hide: panelActions.hide },
          })}
        />
      )}
    </div>
  )
}

type AppProps = {
  theme: Theme
}

function App({ theme }: AppProps) {
  const [selectedText, setSelectedText] = useState<string>('')
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [bubbleOffset, setBubbleOffset] = useState<{ x: number, y: number }>({ x: 20, y: 20 })

  useEffect(() => {
    // 加载设置
    const loadSettings = async () => {
      // 加载气泡偏移配置
      const offset = await BubbleOffsetStorage.getValue()
      setBubbleOffset(offset)
    }
    loadSettings()
  }, [])

  useEffect(() => {
    let lastMousePosition = { x: 0, y: 0 }
    const handleSelectionChange = () => {
      // 使用正则表达式删除所有不可见字符，包括空格、制表符、换行符和其他Unicode不可见字符
      const selectedText = (window.getSelection()?.toString() || '')
        .trim()
        .replace(/^[\s\u200B-\u200D\u2060]+|[\s\u200B-\u200D\u2060]+$/g, '')

      if (selectedText) {
        setSelectedText(selectedText)
        setMousePosition(lastMousePosition)
      }
      else {
        setSelectedText('')
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      lastMousePosition = {
        x: event.clientX + bubbleOffset.x,
        y: event.clientY + bubbleOffset.y,
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [bubbleOffset])

  const contextValue = useMemo(() => ({
    selectedText,
    setSelectedText,
    mousePosition,
    theme,
  }), [selectedText, setSelectedText, mousePosition, theme])

  return (
    <Context value={contextValue}>
      <Container />
    </Context>
  )
}

export default App
