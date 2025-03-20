import { ActionType } from "@/types";

export  const handleAction = (action: ActionType) => {
    if (action === 'menu') {
      console.log('Menu action triggered');
      // 此处可以实现菜单操作的具体逻辑
    }
    // 可以扩展其他类型的操作
  }