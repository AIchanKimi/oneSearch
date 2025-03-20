import { Button } from '@/components/ui/button'

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
      <Button>
        {select ? `Selected text: ${select}` : 'No text selected'}
      </Button>
    </>
  )
}

export default App
