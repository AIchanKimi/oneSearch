import type { Provider } from '@/types'
import { Button } from './ui/button'

type QuickMenuItemProps = {
  provider: Provider
  selectedText?: string
  onAction: (action: any) => void
}

function QuickMenuItem({ provider, selectedText, onAction }: QuickMenuItemProps) {
  if (provider.type === 'action') {
    // ActionProvider: 直接使用 Button 并触发 action
    return (
      <Button 
        variant="outline" 
        size="icon" 
        key={provider.label}
        onClick={() => onAction(provider.action)}
      >
        <img className="size-4" src={provider.icon} alt="" />
      </Button>
    )
  } else {
    const linkUrl = provider.link?.replace('{selectedText}', selectedText || '')
    
    return (
      <Button variant="ghost" size="icon" key={provider.label}>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          <img className="size-4" src={provider.icon} alt="" />
        </a>
      </Button>
    )
  }
}

export default QuickMenuItem
