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
    defaultPosition,
    selectedText = '',
  } = options

  const [isVisible, setIsVisible] = useState(
    defaultVisible && selectedText.trim().length > 0,
  )
  const [isPinned, setIsPinned] = useState(defaultPinned)
  const [position, setPosition] = useState(defaultPosition ?? { x: 0, y: 0 })

  // 监听 selectedText 和 defaultVisible 变化，更新显示状态
  useEffect(() => {
    setIsVisible(defaultVisible && selectedText.trim().length > 0)
  }, [defaultVisible, selectedText])

  // 监听 defaultPinned 变化，更新当前 pinned 状态
  useEffect(() => {
    setIsPinned(defaultPinned)
  }, [defaultPinned])

  // 只有当传入 defaultPosition 时才监听位置变化
  useEffect(() => {
    if (defaultPosition !== undefined) {
      setPosition(defaultPosition)
    }
  }, [defaultPosition])

  // 操作方法
  const show = useCallback(() => {
    setIsVisible(true)
  }, [])

  const hide = useCallback(() => {
    setIsVisible(false)
  }, [])

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const togglePin = useCallback(() => {
    setIsPinned(prev => !prev)
  }, [])

  const updatePosition = useCallback((newPosition: { x: number, y: number }) => {
    setPosition(newPosition)
  }, [])

  const state: UIState = useMemo(() => ({
    isVisible,
    isPinned,
    position,
  }), [isVisible, isPinned, position])

  const actions: UIActions = useMemo(() => ({
    show,
    hide,
    toggle,
    togglePin,
    setPosition: updatePosition,
  }), [show, hide, toggle, togglePin, updatePosition])

  return [state, actions]
}
