import type { ActionProvider } from '@/types'
import BubbleMenu from '@/components/bubble-menu'
import { actionProvider } from '@/provider/action'
import { searchProvider } from '@/provider/search'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Panel from '@/components/panel'

type SelectionContextType = {
  selectedText: string
  mousePosition: { x: number, y: number }
}

const SelectionContext = createContext<SelectionContextType>({
  selectedText: '',
  mousePosition: { x: 0, y: 0 },
})

function Container() {
  const context = useContext(SelectionContext)
  const items = useMemo(() => [...searchProvider, ...actionProvider], [])
  const [quickMenuItems, setQuickMenuItems] = useState<ActionProvider[]>([])
  const { selectedText, mousePosition } = context
  const [showPanel, setShowPanel] = useState(false)
  
  useEffect(() => {
    const tempList = items.map((item) => {
      item.payload.source = window.location.href
      item.payload.selectedText = selectedText
      return item
    })
    setQuickMenuItems(tempList.filter((item)=>item.bubble === true))
  }, [selectedText, items])

  const handleOpenPanel = () => {
    setShowPanel(true)
  }

  const handleClosePanel = () => {
    setShowPanel(false)
  }

  return (
    <>
      {selectedText && (
        <>
        {!showPanel ? (
          <BubbleMenu
            mousePosition={mousePosition}
            items={quickMenuItems}
          />
        ) : (
          <Panel  
            isOpen={true}
            items={quickMenuItems}
            onClose={handleClosePanel}
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

  const contextValue = useMemo(() => ({ selectedText, mousePosition }), [selectedText, mousePosition])

  return (
    <SelectionContext value={contextValue}>
      <Container />
    </SelectionContext>
  )
}

export default App
