import type { ActionProvider } from '@/types'
import { Context } from '@/entrypoints/content/App'
import { GripVertical } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './bubble.module.css'
import MenuItem from './menu-item'

type BubbleMenuProps = {
  mousePosition: { x: number, y: number }
  items: ActionProvider[]
  isPinned: boolean
  onTogglePin: () => void
  onPositionChange: (position: { x: number, y: number }) => void
  onMenuItemClick: (provider: ActionProvider) => void // 新增：统一的action处理
}

function Bubble({
  mousePosition,
  items,
  isPinned,
  onTogglePin,
  onPositionChange,
  onMenuItemClick,
}: BubbleMenuProps) {
  const { theme } = useContext(Context)

  // 拖拽相关状态（本地状态，不持久化）
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState(mousePosition)
  const [isUserPositioned, setIsUserPositioned] = useState(false) // 用户是否手动调整过位置
  const bubbleRef = useRef<HTMLDivElement>(null)

  // 当mousePosition更新且用户没有手动移动过时，自动跟随新位置
  useEffect(() => {
    if (!isUserPositioned && !isDragging) {
      setCurrentPosition(mousePosition)
    }
  }, [mousePosition, isUserPositioned, isDragging])

  // 拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsUserPositioned(true) // 标记用户已手动调整位置
    setDragStart({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    })
  }

  // 全局鼠标事件监听
  useEffect(() => {
    if (!isDragging)
      return

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
      setCurrentPosition(newPosition)
      onPositionChange(newPosition)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, currentPosition, onPositionChange])

  const isOnLeftSide = currentPosition.x < window.innerWidth * 2 / 3

  return (
    <div
      ref={bubbleRef}
      className={`${styles.bubbleContainer} ${theme === 'dark' ? styles.bubbleContainerDark : ''}`}
      style={{
        top: `${currentPosition.y}px`,
        left: `${currentPosition.x}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      {/* 固定状态指示器 */}
      {isPinned && (
        <div
          className={styles.pinIndicator}
          title="已固定 - 点击取消固定"
          onClick={onTogglePin}
        >
          📌
        </div>
      )}

      {/* 左侧handle - 仅在右侧显示时显示且未固定时 */}
      {!isOnLeftSide && !isPinned && (
        <div
          className={`${styles.dragHandle} ${styles.leftHandle}`}
          onMouseDown={handleMouseDown}
          title="拖动bubble"
        >
          <GripVertical />
        </div>
      )}

      {/* 菜单项 */}
      {items.length > 0
        ? (
            items.map(item => (
              <MenuItem
                size="icon"
                key={item.providerId}
                provider={item}
                onClick={onMenuItemClick}
              />
            ))
          )
        : (
            <div className={styles.emptyState}>
              <span>无选项</span>
            </div>
          )}

      {/* 右侧handle - 仅在左侧显示时显示且未固定时 */}
      {isOnLeftSide && !isPinned && (
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
