import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Toaster } from '@/components/ui/sonner'
import { Moon, Sun } from 'lucide-react'
import { Route, Routes } from 'react-router-dom'

// 导入组件
import { Sidebar } from './components/Sidebar'

import BubbleSettings from './pages/BubbleSettings'
import PanelSettings from './pages/PanelSettings'
// 导入页面
import ProvidersSettings from './pages/ProvidersSettings'

function App() {
  const { setTheme } = useTheme()

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b sticky top-0 z-30 bg-background">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex-1 font-bold">
            <h1 className="text-xl">OneSearch</h1>
          </div>

          {/* 主题切换按钮 */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">切换主题</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  浅色
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  深色
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  系统
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边导航栏 */}
        <Sidebar />

        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ProvidersSettings />} />
            <Route path="/bubble" element={<BubbleSettings />} />
            <Route path="/panel" element={<PanelSettings />} />
          </Routes>
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
