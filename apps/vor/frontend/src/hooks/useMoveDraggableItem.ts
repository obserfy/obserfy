/* eslint-disable no-param-reassign */
import { Draft } from "immer/compat/pre-3.7/dist/immer"
import { useCallback } from "react"
import { compareOrder } from "../domain/array"

enum DragYDirection {
  DOWN = -1,
  UP = 1,
}

export interface OrderedItem {
  id: string
  order: number
}

const checkDragDirection = (newOrder: number, currOrder: number) => {
  return newOrder > currOrder ? DragYDirection.DOWN : DragYDirection.UP
}

function capOrder(newOrder: number, direction: DragYDirection, max: number) {
  return direction === DragYDirection.DOWN
    ? Math.min(newOrder, max)
    : Math.max(newOrder, 0)
}

const swapOrder = (
  currItem: OrderedItem,
  newOrder: number,
  direction: DragYDirection
) => (m: OrderedItem) => {
  if (m.id === currItem.id) m.order = newOrder
  else if (m.order === newOrder) m.order += direction
}

const useMoveDraggableItem = (
  setItems: (f: (draft: Draft<OrderedItem[]>) => void) => void
) => {
  const moveItem = (currItem: OrderedItem, newOrder: number) => {
    if (currItem.order === newOrder) return

    // Reorder list to reflect position after dragging
    setItems((draft) => {
      const direction = checkDragDirection(newOrder, currItem.order)
      const cappedOrder = capOrder(newOrder, direction, draft.length - 1)
      draft.forEach(swapOrder(currItem, cappedOrder, direction))
      draft.sort(compareOrder)
    })
  }

  return useCallback(moveItem, [setItems])
}

export default useMoveDraggableItem
