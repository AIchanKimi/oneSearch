import { Button } from '@/components/ui/button'
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
          <Button
            className="fixed z-50"
            style={{
              top: `${mousePosition.y}px`,
              left: `${mousePosition.x}px`,
            }}
          >
            {select}
          </Button>
        )}
    </>
  )
}

export default App
