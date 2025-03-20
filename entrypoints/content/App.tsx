import QuickMenu from '@/components/quick-menu'
import {searchProvider } from '@/provider/search'
import {actionProvider } from '@/provider/action'
import { useEffect, useState } from 'react'

function App() {
  const [select, setSelection] = useState<string>()
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() || '';
      
      if (selectedText) {
        setSelection(selectedText);
        
        // 获取选区的位置
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setMousePosition({ 
            x: rect.right + 10, 
            y: rect.bottom + 10 
          });
        }
      } else {
        setSelection('');
      }
    };
    
    // 监听文本选择变化事件
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const items = [...searchProvider,...actionProvider]
  return (
    <>
      {select
        && (
          <QuickMenu
            mousePosition={mousePosition}
            selectedText={select}
            items={items}
          />
        )}
    </>
  )
}

export default App
