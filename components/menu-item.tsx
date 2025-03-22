import type { ActionProvider } from '@/types'
import { handleAction } from '@/utils/handle-action'
import { Button } from './ui/button'

type QuickMenuItemProps = {
  provider: ActionProvider
}

function QuickMenuItem({ provider }: QuickMenuItemProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      key={provider.label}
      onClick={() => handleAction(provider)}
    >
      <img className="size-4" src={provider.icon} alt="" />
    </Button>
  )
}

export default QuickMenuItem
