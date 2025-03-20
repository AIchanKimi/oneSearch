import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

function App() {
  const [select, setSelection] = useState<string>()
  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString() || ''
      setSelection(selectedText)
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })
  return (
    <>
      {select
        && (
          <Button
            className="fixed top-2.5 left-2.5 z-50"
          >
            {select}
          </Button>
        )}
    </>
  )
}

export default App
