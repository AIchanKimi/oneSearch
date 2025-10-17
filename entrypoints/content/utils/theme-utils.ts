export type Theme = 'light' | 'dark'
export type ThemeSetting = 'light' | 'dark' | 'system'

/**
 * 检测页面当前主题
 * 通过分析页面背景色来判断主题
 */
export function detectPageTheme(): Theme {
  try {
    // 获取document.documentElement的背景色
    const computedStyle = getComputedStyle(document.documentElement)
    let backgroundColor = computedStyle.backgroundColor

    // 如果root元素没有背景色，尝试body元素
    if (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      const bodyStyle = getComputedStyle(document.body)
      backgroundColor = bodyStyle.backgroundColor
    }

    // 如果仍然没有背景色，使用系统主题作为fallback
    if (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // 解析RGB值
    const rgbMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number)
      // 计算亮度 - 使用ITU-R BT.709公式
      const brightness = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255
      return brightness > 0.5 ? 'light' : 'dark'
    }

    // 如果无法解析，fallback到系统主题
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  catch (error) {
    console.warn('Failed to detect page theme:', error)
    // 发生错误时fallback到系统主题
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}

/**
 * 检测系统主题
 */
export function detectSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 计算RGB颜色的亮度
 */
export function calculateBrightness(r: number, g: number, b: number): number {
  return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255
}

/**
 * 判断颜色是否为浅色
 */
export function isLightColor(brightness: number): boolean {
  return brightness > 0.5
}

/**
 * 根据用户设置的主题获取实际主题
 * @param themeSetting 用户设置的主题 ('light' | 'dark' | 'system')
 * @returns 实际的主题 ('light' | 'dark')
 */
export function getEffectiveTheme(themeSetting: ThemeSetting): Theme {
  switch (themeSetting) {
    case 'light':
      return 'light'
    case 'dark':
      return 'dark'
    case 'system':
      return detectSystemTheme()
    default:
      return detectSystemTheme()
  }
}
