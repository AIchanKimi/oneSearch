import type { ActionProvider } from '@/types'
import BubbleMenu from '@/components/bubble-menu'
import Panel from '@/components/panel'
import { actionProvider } from '@/provider/action'
import { searchProvider } from '@/provider/search'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ContextType = {
  selectedText: string
  mousePosition: { x: number, y: number }
  showPanel: boolean
  openPanel: () => void
  closePanel: () => void
}

const Context = createContext<ContextType>({
  selectedText: '',
  mousePosition: { x: 0, y: 0 },
  showPanel: false,
  openPanel: () => {},
  closePanel: () => {},
})

// 导出全局控制函数，供handleAction使用
export let globalOpenPanel: () => void = () => {}

function Container() {
  const context = useContext(Context)
  const items = useMemo(() => [...searchProvider, ...actionProvider], [])
  const [quickMenuItems, setQuickMenuItems] = useState<ActionProvider[]>([])
  const { selectedText, mousePosition, showPanel, closePanel } = context

  useEffect(() => {
    const tempList = items.map((item) => {
      item.payload.source = window.location.href
      item.payload.selectedText = selectedText
      return item
    })
    setQuickMenuItems(tempList.filter(item => item.bubble === true))
  }, [selectedText, items])

  return (
    <>
      {selectedText && (
        <>
          {!showPanel
            ? (
                <BubbleMenu
                  mousePosition={mousePosition}
                  items={quickMenuItems}
                />
              )
            : (
                <Panel
                  isOpen
                  items={quickMenuItems}
                  onClose={closePanel}
                />
              )}
        </>
      )}
    </>
  )
}

function App() {
  const [selectedText, setSelectedText] = useState<string>('')
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [showPanel, setShowPanel] = useState(false)

  // 创建面板操作函数
  const openPanel = () => setShowPanel(true)
  const closePanel = () => setShowPanel(false)

  // 更新全局函数
  useEffect(() => {
    globalOpenPanel = openPanel
  }, [])

  useEffect(() => {
    let lastMousePosition = { x: 0, y: 0 }
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() || ''
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
        x: event.clientX + 20,
        y: event.clientY + 20,
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const contextValue = useMemo(() => ({
    selectedText,
    mousePosition,
    showPanel,
    openPanel,
    closePanel,
  }), [selectedText, mousePosition, showPanel])

  return (
    <Context value={contextValue}>
      <Container />
    </Context>
  )
}

export default App
