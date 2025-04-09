import { Button } from '@/components/ui/button'
import { sendMessage } from '@/utils/message'
import { useEffect } from 'react'

function App() {
  const [data, setdata] = useState(0)
  useEffect(() => {
    async function fetchData() {
      const length = await sendMessage('getStringLength', 'hello world')
      setdata(length)
    }
    fetchData()
  }, [])

  return (
    <div className="container">
      <header>
        <h1>One Search 选项</h1>
        { data}
      </header>
      <main>
        <div className="button-container">
          <Button>示例按钮</Button>
        </div>
      </main>
    </div>
  )
}

export default App
