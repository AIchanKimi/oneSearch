import { cn } from '@/lib/utils'
import { LayoutGrid, Settings, Sliders } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    {
      title: '服务提供商',
      href: '/',
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      title: '气泡设置',
      href: '/bubble',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: '面板设置',
      href: '/panel',
      icon: <Sliders className="h-5 w-5" />,
    },
  ]

  return (
    <div className="bg-card border-r h-full w-64 py-4 flex flex-col flex-shrink-0">
      <div className="px-4 py-2 mb-6">
        <h2 className="text-2xl font-bold">OneSearch 设置</h2>
      </div>
      <nav className="space-y-1 px-2 flex-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-all',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
