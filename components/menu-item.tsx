import type { ActionProvider } from '@/types'
import { handleAction } from '@/utils/handle-action'
import { Button } from './ui/button'

type MenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
  menuAction: (arg?: any) => any
}

function MenuItem({ provider, size = 'normal', menuAction }: MenuItemProps) {
  return (
    <Button
      variant="outline"
      size={size === 'icon' ? 'icon' : 'default'}
      key={provider.label}
      onClick={() => handleAction(provider, () => menuAction())}
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

export default MenuItem
