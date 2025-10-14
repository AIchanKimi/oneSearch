import { useCallback, useEffect, useState } from 'react'

export type UIState = {
  isVisible: boolean
  isPinned: boolean
  position: { x: number, y: number }
}

export type UIActions = {
  show: () => void
  hide: () => void
  toggle: () => void
  togglePin: () => void
  setPosition: (position: { x: number, y: number }) => void
}

export type UseUIControlOptions = {
  defaultVisible?: boolean
  defaultPinned?: boolean
  defaultPosition?: { x: number, y: number }
  selectedText?: string // 新增：控制是否显示
}

/**
 * UI控制Hook
 * 管理单个UI组件的状态
 */
export function useUIControl(options: UseUIControlOptions): [UIState, UIActions] {
  const {
    defaultVisible = false,
    defaultPinned = false,
    defaultPosition = { x: 0, y: 0 },
    selectedText = '',
  } = options

  const [isVisible, setIsVisible] = useState(
    defaultVisible && selectedText.trim().length > 0,
  )
  const [isPinned, setIsPinned] = useState(defaultPinned)
  const [position, setPosition] = useState(defaultPosition)

  // 当selectedText变化时，更新显示状态
  const [prevSelectedText, setPrevSelectedText] = useState(selectedText)
  const [prevDefaultPosition, setPrevDefaultPosition] = useState(defaultPosition)

  // 监听selectedText变化
  if (prevSelectedText !== selectedText) {
    setPrevSelectedText(selectedText)
    setIsVisible(defaultVisible && selectedText.trim().length > 0)
  }

  // 监听defaultPosition变化，更新当前position
  useEffect(() => {
    if (prevDefaultPosition.x !== defaultPosition.x || prevDefaultPosition.y !== defaultPosition.y) {
      setPrevDefaultPosition(defaultPosition)
      setPosition(defaultPosition)
    }
  }, [defaultPosition, prevDefaultPosition])

  // 操作方法
  const show = useCallback(() => {
    setIsVisible(true)
  }, [])

  const hide = useCallback(() => {
    if (!isPinned) {
      setIsVisible(false)
    }
  }, [isPinned])

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const togglePin = useCallback(() => {
    setIsPinned(prev => !prev)
  }, [])

  const updatePosition = useCallback((newPosition: { x: number, y: number }) => {
    setPosition(newPosition)
  }, [])

  const state: UIState = {
    isVisible,
    isPinned,
    position,
  }

  const actions: UIActions = {
    show,
    hide,
    toggle,
    togglePin,
    setPosition: updatePosition,
  }

  return [state, actions]
}
