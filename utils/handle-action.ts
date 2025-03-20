import { ActionType } from "@/types";

export const handleAction = (action: ActionType) => {
switch (action) {
  case 'menu':
    console.log('menu');
    break;
    default:
    console.log('default');
    break;
}
  }