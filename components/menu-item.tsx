import type { Provider } from '@/types'
import { Button } from './ui/button'
import {handleAction} from '@/utils/handle-action'

type QuickMenuItemProps = {
  provider: Provider
  selectedText?: string
}

function QuickMenuItem({ provider, selectedText }: QuickMenuItemProps) {
  if (provider.type === 'action') {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        key={provider.label}
        onClick={() => handleAction(provider.action)}
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
