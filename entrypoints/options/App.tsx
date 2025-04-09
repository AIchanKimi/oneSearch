import type { ActionProvider } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ActionProviderStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState<ActionProvider[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      const storageData = await ActionProviderStorage.getValue()
      setData(storageData)
    }
    fetchData()
  }, [])

  // 处理编辑状态
  const handleEdit = (index: number) => {
    setEditingIndex(index)
  }

  // 处理删除项目
  const handleDelete = (index: number) => {
    const newData = [...data]
    newData.splice(index, 1)
    setData(newData)
  }

  // 处理添加新项
  const handleAddNew = () => {
    const newItem: ActionProvider = {
      label: '新项目',
      bubble: false,
      panel: false,
      type: 'search',
      icon: '',
      tag: '',
      payload: {
        link: '',
        selectedText: '',
        source: '',
      },
    }
    setData([...data, newItem])
  }

  // 处理数据更新
  const handleDataChange = <K extends keyof ActionProvider>(index: number, field: K, value: ActionProvider[K]) => {
    const newData = [...data]
    newData[index][field] = value
    setData(newData)
  }

  // 保存所有更改
  const handleSave = async () => {
    await ActionProviderStorage.setValue(data)
    setEditingIndex(null)
    alert('数据已保存成功！')
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingIndex(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">One Search 选项</h1>
          <p className="bg-slate-100 px-3 py-1 rounded-lg">
            数据长度:
            {data.length}
          </p>
        </div>
      </header>
      <main className="flex-1">
        <div className="storage-content">
          <h2 className="text-xl font-semibold mb-4">存储内容：</h2>
          {data.length > 0
            ? (
                <div className="data-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.map((item, index) => (
                    <Card key={item.label || index} className="mb-4 flex flex-col">
                      <CardContent className="space-y-4 flex-1 p-4">
                        {/* 标签作为独立项目显示 */}
                        <div>
                          <Label htmlFor={`label-${index}`}>标签</Label>
                          <Input
                            id={`label-${index}`}
                            value={item.label || ''}
                            className="mt-1"
                            readOnly={editingIndex !== index}
                            onChange={e => handleDataChange(index, 'label', e.target.value)}
                          />
                        </div>

                        {/* 布尔值使用Switch组件 */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`bubble-${index}`}>气泡显示</Label>
                          <Switch
                            id={`bubble-${index}`}
                            checked={item.bubble}
                            disabled={editingIndex !== index}
                            onCheckedChange={checked => handleDataChange(index, 'bubble', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor={`panel-${index}`}>面板显示</Label>
                          <Switch
                            id={`panel-${index}`}
                            checked={item.panel}
                            disabled={editingIndex !== index}
                            onCheckedChange={checked => handleDataChange(index, 'panel', checked)}
                          />
                        </div>

                        {/* 图标使用图片显示 */}
                        {item.icon && (
                          <div>
                            <Label>图标</Label>
                            <div className="mt-2 flex items-center">
                              <img
                                src={item.icon}
                                alt="图标"
                                className="w-12 h-12 object-contain border rounded p-1"
                              />
                            </div>
                          </div>
                        )}

                        {/* 类型使用Select */}
                        <div>
                          <Label htmlFor={`type-${index}`}>类型</Label>
                          <Select
                            defaultValue={item.type}
                            disabled={editingIndex !== index}
                            onValueChange={value => handleDataChange(index, 'type', value as ActionProvider['type'])}
                          >
                            <SelectTrigger id={`type-${index}`} className="mt-1">
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="search">搜索</SelectItem>
                              <SelectItem value="menu">菜单</SelectItem>
                              <SelectItem value="copy">复制</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 其他属性使用Input */}
                        {item.tag !== undefined && (
                          <div>
                            <Label htmlFor={`tag-${index}`}>标签分类</Label>
                            <Input
                              id={`tag-${index}`}
                              value={item.tag}
                              className="mt-1"
                              readOnly={editingIndex !== index}
                              onChange={e => handleDataChange(index, 'tag', e.target.value)}
                            />
                          </div>
                        )}

                        {item.payload && (
                          <div>
                            <Label>配置信息</Label>
                            <pre className="overflow-auto max-h-40 bg-muted p-2 rounded mt-1 text-xs">
                              {JSON.stringify(item.payload, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="flex justify-end space-x-2 mt-auto pt-2">
                          {editingIndex === index
                            ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                  >
                                    取消
                                  </Button>
                                </>
                              )
                            : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(index)}
                                >
                                  编辑
                                </Button>
                              )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(index)}
                          >
                            删除
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            : (
                <p className="flex items-center justify-center h-32 bg-slate-50 rounded-lg">暂无数据</p>
              )}
        </div>
        <div className="button-container mt-6 flex justify-between items-center">
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <span>+</span>
            {' '}
            添加新项
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <span>💾</span>
            {' '}
            保存更改
          </Button>
        </div>
      </main>
    </div>
  )
}

export default App
