import type { ActionProvider } from '@/types'
import { Button } from './ui/button'
import {handleAction} from '@/utils/handle-action'

type QuickMenuItemProps = {
  provider: ActionProvider
  selectedText?: string
}

function QuickMenuItem({ provider, selectedText }: QuickMenuItemProps) {
    return( <Button 
        variant="outline" 
        size="icon" 
        key={provider.label}
        onClick={() => handleAction(provider)}
      >
        <img className="size-4" src={provider.icon} alt="" />
      </Button>)
}

export default QuickMenuItem
