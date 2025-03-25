import type { ActionProvider } from '@/types'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { handleAction } from '@/utils/handle-action'
import { cva } from 'class-variance-authority'
import { Button } from './ui/button'

const menuItemVariants = cva('flex items-center', {
  variants: {
    size: {
      icon: '',
      normal: 'gap-2 justify-start w-28',
    },
  },
  defaultVariants: {
    size: 'normal',
  },
})

type MenuItemProps = {
  provider: ActionProvider
  size?: 'icon' | 'normal'
  menuAction: (arg?: any) => any
} & VariantProps<typeof menuItemVariants>

function MenuItem({ provider, size = 'normal', menuAction }: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      size={size === 'icon' ? 'icon' : 'default'}
      key={provider.label}
      className={cn(menuItemVariants({ size }))}
      onClick={() => handleAction(provider, () => menuAction())}
    >
      <div className="flex items-center gap-2 truncate">
        <img className="size-4" src={provider.icon} alt="" />
        { size === 'normal' && (
          <span>
            {provider.label}
          </span>
        )}
      </div>
    </Button>
  )
}

export default MenuItem
