import type { SearchProvider } from '@/types'
import { Button } from './ui/button'

type QuickMenuProps = {
  mousePosition: { x: number, y: number }
  items?: SearchProvider[]
  selectedText?: string
}

function QuickMenu({ mousePosition, items, selectedText }: QuickMenuProps) {
  return (items && items.length > 0) && (
    <div
      className="bg-background rounded-md fixed z-50 flex items-center gap-2"
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
      }}
    >
      {items.map((item) => {
        const linkUrl = item.link?.replace('{selectedText}', selectedText || '')

        return (
          <Button variant="ghost" size="icon" key={item.label}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              <img className="size-4" src={item.icon} alt="" />
            </a>
          </Button>
        )
      })}
    </div>
  )
}

export default QuickMenu
