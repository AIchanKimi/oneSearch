import type { ActionProvider } from '@/types'
import Bubble from '@/components/bubble'
import Panel from '@/components/panel'
import { actionProvider } from '@/provider/action'
import { searchProvider } from '@/provider/search'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ContextType = {
  selectedText: string
  mousePosition: { x: number, y: number }
  showPanel: boolean
  setShowPanel: (_: boolean) => void
}

const Context = createContext<ContextType>({
  selectedText: '',
  mousePosition: { x: 0, y: 0 },
  showPanel: false,
  setShowPanel: () => {},
})

function Container() {
  const context = useContext(Context)
  const items = useMemo(() => [...searchProvider, ...actionProvider], [])
  const [bubbleItems, setBubbleItems] = useState<ActionProvider[]>([])
  const [panelItems, setPanelItems] = useState<ActionProvider[]>([])
  const { selectedText, mousePosition, showPanel, setShowPanel } = context

  useEffect(() => {
    const tempList = items.map((item) => {
      item.payload.source = window.location.href
      item.payload.selectedText = selectedText
      return item
    })
    setBubbleItems(tempList.filter(item => item.bubble === true))
    setPanelItems(tempList.filter(item => item.panel === true))
  }, [selectedText, items])

  return (
    <div
      onMouseDown={e => e.preventDefault()}
    >
      {selectedText && (
        <>
          {!showPanel
            ? (
                <Bubble
                  mousePosition={mousePosition}
                  items={bubbleItems}
                  setShowPanel={setShowPanel}
                />
              )
            : (
                <Panel
                  items={panelItems}
                  setShowPanel={setShowPanel}
                />
              )}
        </>
      )}
    </div>
  )
}

function App() {
  const [selectedText, setSelectedText] = useState<string>('')
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    let lastMousePosition = { x: 0, y: 0 }
    const handleSelectionChange = () => {
      // 使用正则表达式删除所有不可见字符，包括空格、制表符、换行符和其他Unicode不可见字符
      const selectedText = (window.getSelection()?.toString() || '')
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
    setShowPanel,
  }), [selectedText, mousePosition, showPanel])

  return (
    <Context value={contextValue}>
      <Container />
    </Context>
  )
}

export default App
