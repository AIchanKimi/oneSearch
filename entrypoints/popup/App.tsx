import { Button } from '@/components/ui/button'
import React from 'react'

// 为全局常量添加类型声明
declare const __APP_VERSION__: string

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
        <Button asChild variant="default" size="default">
          <a
            href="https://github.com/AIchanKimi/oneSearch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            项目主页
          </a>
        </Button>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-4 border-t border-gray-200 pt-3">
        <p className="m-0">
          v
          {__APP_VERSION__}
        </p>
      </footer>
    </div>
  )
}

export default App
