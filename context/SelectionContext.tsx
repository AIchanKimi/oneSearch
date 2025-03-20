import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SelectionContextType {
  selectedText: string;
  mousePosition: { x: number, y: number };
  setSelectedText: (text: string) => void; // 添加设置文本的方法
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children }) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() || '';
      
      if (selectedText) {
        setSelectedText(selectedText);
        
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
        setSelectedText('');
      }
    };
    
    // 监听文本选择变化事件
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedText, mousePosition, setSelectedText }}>
      {children}
    </SelectionContext.Provider>
  );
};
