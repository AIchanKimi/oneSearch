import QuickMenu from '@/components/QuickMenu'
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
            items={[{ label: '链接', link: '{selectedText}', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbGluayI+PHBhdGggZD0iTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzEiLz48cGF0aCBkPSJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzEiLz48L3N2Zz4=' }]}
          />
        )}
    </>
  )
}

export default App
