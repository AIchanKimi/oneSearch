import type { ActionProvider } from '@/types'
import type { UISettings } from '@/utils/storage'
import type { UIAction, UIConfig } from './utils/action-types'
import type { Theme } from './utils/theme-utils'
import Bubble from '@/components/bubble'
import Panel from '@/components/panel'
import { ActionProviderStorage, UISettingsStorage } from '@/utils/storage'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useThrottle } from 'react-use'
import { useUIControl } from './hooks/useUIControl'
import { createActionHandler } from './utils/action-handler'

type ContextType = {
  selectedText: string
  setSelectedText: (_: string) => void
  mousePosition: { x: number, y: number }
  theme: Theme
}

export const Context = createContext<ContextType>({
  selectedText: '',
  setSelectedText: () => {},
  mousePosition: { x: 0, y: 0 },
  theme: 'light',
})

function Container() {
  const context = useContext(Context)
  const [bubbleItems, setBubbleItems] = useState<ActionProvider[]>([])
  const [panelItems, setPanelItems] = useState<ActionProvider[]>([])
  const [uiSettings, setUISettings] = useState<UISettings | null>(null)
  const { selectedText, mousePosition } = context

  // 加载UI设置
  useEffect(() => {
    const loadUISettings = async () => {
      const settings = await UISettingsStorage.getValue()
      setUISettings(settings)
    }
    loadUISettings()
  }, [])

  // 缓存气泡的默认位置，避免频繁重新计算
  const bubbleDefaultPosition = useMemo(() => ({
    x: mousePosition.x + (uiSettings?.bubble.offset.x || 0),
    y: mousePosition.y + (uiSettings?.bubble.offset.y || 0),
  }), [mousePosition.x, mousePosition.y, uiSettings?.bubble.offset.x, uiSettings?.bubble.offset.y])

  // 使用两个独立的UI控制
  const [bubbleState, bubbleActions] = useUIControl({
    defaultVisible: uiSettings?.bubble.defaultVisible ?? true,
    defaultPosition: bubbleDefaultPosition,
    selectedText,
  })
  const [panelState, panelActions] = useUIControl({
    defaultVisible: uiSettings?.panel.defaultVisible ?? false,
    defaultPinned: uiSettings?.panel.defaultPinned ?? false,
    selectedText,
  })

  // Action处理逻辑
  const actionHandler = createActionHandler()

  // UI 配置数组
  const uiConfigs = useMemo(() => [
    {
      key: 'bubble',
      state: bubbleState,
      actions: bubbleActions,
    },
    {
      key: 'panel',
      state: panelState,
      actions: panelActions,
    },
  ], [bubbleState, bubbleActions, panelState, panelActions])

  // UI 动作执行器
  const executeUIAction = useCallback((
    action: UIAction,
    uiConfigs: UIConfig[],
  ) => {
    switch (action.type) {
      case 'show': {
        const targetConfig = uiConfigs.find(c => c.key === action.target)
        targetConfig?.actions.show()
        break
      }

      case 'hide': {
        if (action.target === 'current') {
          // 隐藏当前显示的 UI
          const currentConfig = uiConfigs.find(c => c.state.isVisible)
          currentConfig?.actions.hide()
        }
        else {
          const targetConfig = uiConfigs.find(c => c.key === action.target)
          targetConfig?.actions.hide()
        }
        break
      }

      case 'replace': {
        const sourceConfig = uiConfigs.find(c => c.key === action.source)
        const targetConfig = uiConfigs.find(c => c.key === action.target)
        sourceConfig?.actions.hide()
        targetConfig?.actions.show()
        break
      }

      case 'toggle': {
        const targetConfig = uiConfigs.find(c => c.key === action.target)
        targetConfig?.actions.toggle()
        break
      }

      case 'close': {
        if (action.target === 'current') {
          // 智能关闭当前显示的 UI，检查固定状态
          const currentConfig = uiConfigs.find(c => c.state.isVisible)
          if (currentConfig && !currentConfig.state.isPinned) {
            currentConfig.actions.hide()
          }
        }
        else {
          const targetConfig = uiConfigs.find(c => c.key === action.target)
          if (targetConfig && !targetConfig.state.isPinned) {
            targetConfig.actions.hide()
          }
        }
        break
      }
    }
  }, [])

  // 统一的action处理函数
  const handleMenuItemClick = useCallback(async (provider: ActionProvider) => {
    try {
      const result = await actionHandler.executeAction(provider)

      // 处理 UI 动作指令
      if (result.uiAction) {
        executeUIAction(result.uiAction, uiConfigs)
        return // 执行 UI 动作后提前返回
      }

      // 如果没有明确的 UI 动作指令，执行默认关闭行为
      executeUIAction({
        type: 'close',
        target: 'current',
      }, uiConfigs)

      // 处理错误情况
      if (!result.success && result.error) {
        console.error('Action failed:', result.error)
      }
    }
    catch (error) {
      console.error('Error executing action:', error)
    }
  }, [actionHandler, executeUIAction, uiConfigs])

  useEffect(() => {
    async function fetchItems() {
      const items = await ActionProviderStorage.getValue()
      const tempList = items.map((item) => {
        item.payload.source = window.location.href
        item.payload.selectedText = selectedText
        return item
      })

      // 获取气泡项并按order排序
      const bubbleList = tempList.filter(item => item.bubble === true)
      const sortedBubbleList = bubbleList.sort((a, b) => {
        if (a.order === undefined && b.order === undefined)
          return 0
        if (a.order === undefined)
          return 1
        if (b.order === undefined)
          return -1
        return a.order - b.order
      })

      setBubbleItems(sortedBubbleList)
      setPanelItems(tempList.filter(item => item.panel === true))
    }

    fetchItems()
  }, [selectedText])

  return (
    <div onMouseDown={e => e.preventDefault()}>
      {/* Bubble组件 */}
      {bubbleState.isVisible && (
        <Bubble
          mousePosition={bubbleState.position}
          items={bubbleItems}
          isPinned={bubbleState.isPinned}
          onTogglePin={bubbleActions.togglePin}
          onPositionChange={bubbleActions.setPosition}
          onMenuItemClick={provider => handleMenuItemClick(provider)}
        />
      )}

      {/* Panel组件 */}
      {panelState.isVisible && (
        <Panel
          items={panelItems}
          isPinned={panelState.isPinned}
          onClose={panelActions.hide}
          onTogglePin={panelActions.togglePin}
          onMenuItemClick={provider => handleMenuItemClick(provider)}
        />
      )}
    </div>
  )
}

type AppProps = {
  theme: Theme
}

function App({ theme }: AppProps) {
  const [selectedText, setSelectedText] = useState<string>('')
  const [rawMousePosition, setRawMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [uiSettings, setUISettings] = useState<UISettings | null>(null)

  // 使用 useThrottle 来节流鼠标位置更新，减少计算频率
  const mousePosition = useThrottle(rawMousePosition, 16) // 约60fps

  useEffect(() => {
    // 加载设置
    const loadSettings = async () => {
      // 加载UI设置
      const settings = await UISettingsStorage.getValue()
      setUISettings(settings)
    }
    loadSettings()
  }, [])

  useEffect(() => {
    let lastMousePosition = { x: 0, y: 0 }
    let isMouseDown = false
    let tempSelectedText = ''

    const handleSelectionChange = () => {
      // 使用正则表达式删除所有不可见字符，包括空格、制表符、换行符和其他Unicode不可见字符
      const selectedText = (window.getSelection()?.toString() || '')
        .trim()
        .replace(/^[\s\u200B-\u200D\u2060]+|[\s\u200B-\u200D\u2060]+$/g, '')

      if (isMouseDown) {
        // 鼠标按下时，将文本存到临时变量
        tempSelectedText = selectedText
      }
      else {
        // 鼠标未按下时，直接更新选中文本
        if (selectedText) {
          setSelectedText(selectedText)
          setRawMousePosition({
            x: lastMousePosition.x,
            y: lastMousePosition.y,
          })
        }
        else {
          setSelectedText('')
        }
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const offsetX = uiSettings?.bubble.offset.x || 0
      const offsetY = uiSettings?.bubble.offset.y || 0

      lastMousePosition = {
        x: event.clientX + offsetX,
        y: event.clientY + offsetY,
      }
    }

    const handleMouseDown = () => {
      isMouseDown = true
    }

    const handleMouseUp = () => {
      isMouseDown = false

      // 鼠标弹起时，将临时变量中的文本更新到状态
      if (tempSelectedText) {
        setSelectedText(tempSelectedText)
        setRawMousePosition({
          x: lastMousePosition.x,
          y: lastMousePosition.y,
        })
      }
      else {
        setSelectedText('')
      }
      tempSelectedText = ''
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [uiSettings?.bubble.offset.x, uiSettings?.bubble.offset.y])

  const contextValue = useMemo(() => ({
    selectedText,
    setSelectedText,
    mousePosition,
    theme,
  }), [selectedText, setSelectedText, mousePosition, theme])

  return (
    <Context value={contextValue}>
      <Container />
    </Context>
  )
}

export default App
