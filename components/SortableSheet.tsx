import type { DropResult } from '@hello-pangea/dnd'
import type React from 'react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { MoveVertical } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet'

type SortableItem = {
  id: string
  // Add other properties your items might have, e.g., label, icon
  [key: string]: any
}

type SortableSheetProps<T extends SortableItem> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  items: T[]
  onDragEnd: (result: DropResult) => void
  onSave: () => void
  renderItem: (item: T, index: number) => React.ReactNode // Function to render each item
}

export function SortableSheet<T extends SortableItem>({
  open,
  onOpenChange,
  title,
  description,
  items,
  onDragEnd,
  onSave,
  renderItem,
}: SortableSheetProps<T>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sortable-list">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin" // Adjust max height as needed
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {prov => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex items-center mx-3 p-3 border rounded bg-white hover:bg-gray-50 cursor-move"
                        >
                          <MoveVertical size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            {renderItem(item, index)}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-end gap-2 mx-3 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={onSave}>
              保存排序
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
