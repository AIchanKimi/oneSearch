import QuickMenu from '@/components/QuickMenu'
import { items } from '@/provider'
import { useEffect, useState } from 'react'

function App() {
  const [select, setSelection] = useState<string>()
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const selectedText = window.getSelection()?.toString() || ''
      setSelection(selectedText)
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

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
