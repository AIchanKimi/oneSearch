import type { ActionProvider } from '@/types'
import { GripVertical } from 'lucide-react'
import React, { useRef, useState } from 'react'
import styles from './bubble.module.css'
import MenuItem from './menu-item'

type BubbleMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
  setShowPanel: (_: boolean) => void
}

function Bubble({ mousePosition, items, setShowPanel }: BubbleMenuProps) {
  const [position, setPosition] = useState({ x: mousePosition.x, y: mousePosition.y })
  const [isDragging, setIsDragging] = useState(false)
  const [hasBeenDragged, setHasBeenDragged] = useState(false) // 记录是否被手动拖动过
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [handleSide, setHandleSide] = useState<'left' | 'right'>(() =>
    mousePosition.x < window.innerWidth * 2 / 3 ? 'right' : 'left',
  ) // 记录handle应该显示在哪一侧
  const bubbleRef = useRef<HTMLDivElement>(null)

  // 只在非拖动状态下判断handle位置
  const isOnLeftSide = handleSide === 'right'

  // 当mousePosition更新且用户没有手动拖动过时，自动跟随新位置
  React.useEffect(() => {
    if (!hasBeenDragged && !isDragging) {
      setPosition({ x: mousePosition.x, y: mousePosition.y })
      // 同时更新handle位置
      setHandleSide(mousePosition.x < window.innerWidth * 2 / 3 ? 'right' : 'left')
    }
  }, [mousePosition.x, mousePosition.y, hasBeenDragged, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setHasBeenDragged(true) // 标记为已被手动拖动
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (!isDragging)
      return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      // 拖动结束后，根据最终位置更新handle显示位置
      const finalX = position.x
      setHandleSide(finalX < window.innerWidth * 2 / 3 ? 'right' : 'left')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, position.x])

  return (items && items.length > 0) && (
    <div
      ref={bubbleRef}
      className={styles.bubbleContainer}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* 左侧handle - 仅在右侧显示时显示 */}
      {!isOnLeftSide && (
        <div
          className={`${styles.dragHandle} ${styles.leftHandle}`}
          onMouseDown={handleMouseDown}
          title="拖动bubble"
        >
          <GripVertical />
        </div>
      )}

      {items.map(item => (
        <MenuItem
          size="icon"
          key={item.providerId}
          provider={item}
          menuAction={setShowPanel}
        />
      ))}

      {/* 右侧handle - 仅在左侧显示时显示 */}
      {isOnLeftSide && (
        <div
          className={`${styles.dragHandle} ${styles.rightHandle}`}
          onMouseDown={handleMouseDown}
          title="拖动bubble"
        >
          <GripVertical />
        </div>
      )}
    </div>
  )
}

export default Bubble
