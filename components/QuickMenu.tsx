export type QuickMenuItem = {
  label: string
  link?: string
  icon?: string
}

type QuickMenuProps = {
  mousePosition: { x: number, y: number }
  items?: Array<QuickMenuItem>
  selectedText?: string
}

function QuickMenu({ mousePosition, items, selectedText }: QuickMenuProps) {
  return (items && items.length > 0) && (
    <div
      className="fixed z-50"
      style={{
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
      }}
    >
      {items.map((item) => {
        const linkUrl = item.link?.replace('{selectedText}', selectedText || '')

        return (
          <a href={linkUrl} key={item.label} target="_blank" rel="noopener noreferrer">
            <img src={item.icon} alt="" />
          </a>
        )
      })}
    </div>
  )
}

export default QuickMenu
