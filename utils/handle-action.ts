import { ActionProvider} from "@/types";

export const handleAction = (action: ActionProvider, clearSelectedText?: () => void) => {
  switch (action.type) {
    case 'menu':
      console.log('menu');
      break;
    case 'search':
      const linkUrl = action.payload.link.replace('{selectedText}', action.payload.selectedText || '')
      console.log(linkUrl);
      break;
    default:
      console.log('default');
      break;
  }
  
  // action 执行完成后清空 selectedText
  if (clearSelectedText) {
    clearSelectedText();
  }
}