import QuickMenu from '@/components/quick-menu'
import {searchProvider } from '@/provider/search'
import {actionProvider } from '@/provider/action'
import { SelectionProvider, useSelection } from '@/context/SelectionContext';

function QuickMenuContainer() {
  const { selectedText, mousePosition, setSelectedText } = useSelection();
  const items = [...searchProvider,...actionProvider];

  // 创建清空选中文本的方法
  const clearSelectedText = () => {
    setSelectedText('');
  };

  return (
    <>
      {selectedText && (
        <QuickMenu
          mousePosition={mousePosition}
          selectedText={selectedText}
          items={items}
          clearSelectedText={clearSelectedText}
        />
      )}
    </>
  );
}

function App() {
  return (
    <SelectionProvider>
      <QuickMenuContainer />
    </SelectionProvider>
  );
}

export default App
