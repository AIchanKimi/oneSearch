import { Button } from '@/components/ui/button'
import React from 'react'

function App() {
  return (
    <div className="w-72 p-4 font-sans bg-white">
      <header className="text-center mb-4 border-b border-gray-200 pb-3">
        <h1 className="m-0 text-xl text-gray-800">OneSearch</h1>
        <p className="mt-2 text-sm text-gray-500">一键搜索多个平台</p>
      </header>

      <div className="flex flex-col gap-3">
        <Button asChild variant="default" size="default">
          <a
            href="options.html"
            target="_blank"
            className="w-full"
          >
            打开设置
          </a>
        </Button>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-4 border-t border-gray-200 pt-3">
        <p className="m-0">v1.0.0</p>
      </footer>
    </div>
  )
}

export default App
