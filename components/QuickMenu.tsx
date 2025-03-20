import { Button } from '@/components/ui/button'

type QuickMenuProps = {
  select?: string
  mousePosition: { x: number, y: number }
}

function QuickMenu({ select, mousePosition }: QuickMenuProps) {
  return (
    <>
      <Button
        className="fixed z-50"
        style={{
          top: `${mousePosition.y}px`,
          left: `${mousePosition.x}px`,
        }}
      >
        {select}
      </Button>
    </>
  )
}

export default QuickMenu
