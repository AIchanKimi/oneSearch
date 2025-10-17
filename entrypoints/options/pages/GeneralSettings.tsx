import type { UISettings } from '@/utils/storage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import { UISettingsStorage } from '@/utils/storage'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GeneralSettings() {
  const [uiSettings, setUISettings] = useState<UISettings>()

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await UISettingsStorage.getValue()
      setUISettings(settings)
    }
    loadSettings()
  }, [])

  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    const currentSettings = await UISettingsStorage.getValue()
    await UISettingsStorage.setValue({
      ...currentSettings,
      theme,
    })
    setUISettings({ ...currentSettings, theme })
  }

  if (!uiSettings) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>通用设置</span>
          </CardTitle>
          <CardDescription>
            配置 OneSearch 的通用外观和行为
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 主题设置 */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium">界面主题</h3>
              <p className="text-sm text-muted-foreground">
                选择 OneSearch 的界面主题，将影响气泡和面板的外观
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">选择主题:</span>
              <ToggleGroup
                type="single"
                value={uiSettings.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => {
                  if (value)
                    updateTheme(value)
                }}
                variant="outline"
              >
                <ToggleGroupItem value="light" aria-label="浅色模式">
                  <Sun className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="深色模式">
                  <Moon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="system" aria-label="跟随系统">
                  <Monitor className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>
                  •
                  <strong>浅色模式</strong>
                  ：始终使用浅色主题
                </li>
                <li>
                  •
                  <strong>深色模式</strong>
                  ：始终使用深色主题
                </li>
                <li>
                  •
                  <strong>跟随系统</strong>
                  ：根据系统设置自动切换（默认）
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
