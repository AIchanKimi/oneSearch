import type { ActionProvider } from '@/types'
import QuickMenu from '@/components/quick-menu'
import { actionProvider } from '@/provider/action'
import { searchProvider } from '@/provider/search'
import { createContext, useContext, useEffect, useState } from 'react'

type SelectionContextType = {
  selectedText: string
  mousePosition: { x: number, y: number }
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined)

function Container() {
  const context = useContext(SelectionContext)

  if (!context) {
    return null
  }

  const { selectedText, mousePosition } = context
  const [quickMenuItems, setQuickMenuItems] = useState<ActionProvider[]>([])
  const items = [...searchProvider, ...actionProvider]
  useEffect(() => {
    setQuickMenuItems(items.map((item) => {
      item.payload.source = window.location.href
      item.payload.selectedText = selectedText
      return item
    }))
  }, [selectedText])
  return (
    <>
      {selectedText && (
        <QuickMenu
          mousePosition={mousePosition}
          items={quickMenuItems}
        />
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

  return (
    <SelectionContext value={{ selectedText, mousePosition }}>
      <Container />
    </SelectionContext>
  )
}

export default App
