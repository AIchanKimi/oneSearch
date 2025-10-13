import type { ActionProvider } from '@/types'
import type { Theme } from './utils/theme-utils'
import Bubble from '@/components/bubble'
import Panel from '@/components/panel'
import { ActionProviderStorage, BubbleOffsetStorage, PanelPinStorage } from '@/utils/storage'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ContextType = {
  selectedText: string
  setSelectedText: (_: string) => void
  mousePosition: { x: number, y: number }
  showPanel: boolean
  setShowPanel: (_: boolean) => void
  isPinned: boolean
  setIsPinned: (_: boolean) => void
  theme: Theme
}

export const Context = createContext<ContextType>({
  selectedText: '',
  setSelectedText: () => {},
  mousePosition: { x: 0, y: 0 },
  showPanel: false,
  setShowPanel: () => {},
  isPinned: false,
  setIsPinned: () => {},
  theme: 'light',
})

function Container() {
  const context = useContext(Context)
  const [bubbleItems, setBubbleItems] = useState<ActionProvider[]>([])
  const [panelItems, setPanelItems] = useState<ActionProvider[]>([])
  const [showBackground, setShowBackground] = useState(false)
  const { selectedText, setSelectedText, mousePosition, showPanel, setShowPanel, setIsPinned } = context

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

  // 处理背景层显示 - 监听鼠标弹起事件
  useEffect(() => {
    const handleMouseUp = () => {
      if (selectedText) {
        setShowBackground(true)
      }
    }

    const handleSelectionChange = () => {
      const selection = window.getSelection()?.toString() || ''
      if (!selection.trim()) {
        setShowBackground(false)
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [selectedText])

  return (
    <div
      onMouseDown={e => e.preventDefault()}
    >
      {selectedText && (
        <>
          {/* 透明背景层 - 延迟显示，点击时关闭面板 */}
          {showBackground && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                backgroundColor: 'transparent',
              }}
              onClick={() => {
                setSelectedText('')
                setShowPanel(false)
                window.getSelection()?.removeAllRanges()
              }}
            />
          )}

          {!showPanel
            ? (
                <Bubble
                  mousePosition={mousePosition}
                  items={bubbleItems}
                  setShowPanel={setShowPanel}
                  setPinnedAction={setIsPinned}
                />
              )
            : (
                <Panel
                  items={panelItems}
                  setShowPanel={setShowPanel}
                  setPinnedAction={setIsPinned}
                />
              )}
        </>
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
  const [showPanel, setShowPanel] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [bubbleOffset, setBubbleOffset] = useState<{ x: number, y: number }>({ x: 20, y: 20 })

  useEffect(() => {
    // 加载设置
    const loadSettings = async () => {
      // 加载气泡偏移配置
      const offset = await BubbleOffsetStorage.getValue()
      setBubbleOffset(offset)

      // 加载面板固定设置
      const panelPin = await PanelPinStorage.getValue()
      setIsPinned(panelPin)
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
        // 只有在UI没有被固定时才清除selectedText
        if (!isPinned) {
          setSelectedText('')
        }
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
  }, [bubbleOffset, isPinned])

  const contextValue = useMemo(() => ({
    selectedText,
    setSelectedText,
    mousePosition,
    showPanel,
    setShowPanel,
    isPinned,
    setIsPinned,
    theme,
  }), [selectedText, setSelectedText, mousePosition, showPanel, isPinned, theme])

  return (
    <Context value={contextValue}>
      <Container />
    </Context>
  )
}

export default App
