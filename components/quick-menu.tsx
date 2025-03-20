import type { Provider } from '@/types'
import { Button } from './ui/button'
import QuickMenuItem from './menu-item'

type QuickMenuProps = {
  mousePosition: { x: number, y: number }
  items?: Provider []
  selectedText?: string
}

function QuickMenu({ mousePosition, items, selectedText }: QuickMenuProps) {
  // 处理 action 的函数
  const handleAction = (action: any) => {
    // 根据 action.type 执行不同操作
    if (action.type === 'menu') {
      console.log('Menu action triggered');
      // 此处可以实现菜单操作的具体逻辑
    }
    // 可以扩展其他类型的操作
  }

  return (items && items.length > 0) && (
    <div
      className="bg-background rounded-md fixed z-50 flex items-center gap-1"
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
      }}
    >
      {items.map((item) => (
        <QuickMenuItem 
          key={item.label}
          provider={item}
          selectedText={selectedText}
          onAction={handleAction}
        />
      ))}
    </div>
  )
}

export default QuickMenu
