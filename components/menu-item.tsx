import type { ActionProvider } from '@/types'
import { handleAction } from '@/utils/handle-action'
import { Button } from './ui/button'

type QuickMenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
}

function QuickMenuItem({ provider, size = 'normal' }: QuickMenuItemProps) {
  return (
    <Button
      variant="outline"
      size={size === 'icon' ? 'icon' : 'default'}
      key={provider.label}
      onClick={() => handleAction(provider)}
    >
      {size === 'icon'
        ? (
            <img className="size-4" src={provider.icon} alt="" />
          )
        : (
            <div className="flex items-center gap-2">
              <img className="size-4" src={provider.icon} alt="" />
              <span>{provider.label}</span>
            </div>
          )}
    </Button>
  )
}

export default QuickMenuItem
