import QuickMenu from '@/components/QuickMenu'
import {searchProvider } from '@/provider/search'
import {actionProvider } from '@/provider/action'
import { useEffect, useState } from 'react'

function App() {
  const [select, setSelection] = useState<string>()
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const selectedText = window.getSelection()?.toString() || ''
      setSelection(selectedText)
      setMousePosition({ x: event.clientX + 20, y: event.clientY + 20 })
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])
const items = [...searchProvider,...actionProvider]
  return (
    <>
      {select
        && (
          <QuickMenu
            mousePosition={mousePosition}
            selectedText={select}
            items={items}
          />
        )}
    </>
  )
}

export default App
