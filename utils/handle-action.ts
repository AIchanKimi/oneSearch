import { ActionProvider} from "@/types";

export const handleAction = (action: ActionProvider) => {
switch (action.type) {
  case 'menu':
    console.log('menu');
    break;
  case 'search':
    const linkUrl = action.payload.link.replace('{selectedText}', action.payload.selectedText || '')
    console.log(linkUrl);

    default:
    console.log('default');
    break;
}
  }