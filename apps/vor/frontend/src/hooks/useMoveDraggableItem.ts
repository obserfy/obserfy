import { Draft } from "immer/compat/pre-3.7/dist/immer"
import { useCallback } from "react"
import { compareOrder } from "../domain/array"
import { Material } from "./api/useGetSubjectMaterials"

interface Item {
  id: string
  order: number
}
const useMoveDraggableItem = (
  height: number,
  item: Item,
  arrLength: number,
  setItems: (f: (draft: Draft<Item[]>) => void) => void
) =>
  useCallback(
    (currOrder: number, offset: number, originalOrder: number) => {
      // swap current item position with item on the next position
      const swapPosition = (direction: number, newOrder: number) => (
        m: Material
      ) => {
        // eslint-disable-next-line no-param-reassign
        if (m.id === item.id) m.order = newOrder
        // eslint-disable-next-line no-param-reassign
        else if (m.order === newOrder) m.order += direction
      }

      // Calculate position inside the list while being dragged
      let position: number
      if (offset < 0) {
        position = Math.ceil((offset - height / 2) / height)
      } else {
        position = Math.floor((offset + height / 2) / height)
      }
      const newPosition = originalOrder + position

      let finalPosition = item.order
      let direction = 1
      if (newPosition < currOrder) {
        finalPosition = Math.max(newPosition, 0)
      } else if (newPosition > currOrder) {
        finalPosition = Math.min(newPosition, arrLength - 1)
        direction = -1
      }

      // Reorder list to reflect position after dragging
      if (item.order !== finalPosition) {
        setItems((draft) => {
          draft.forEach(swapPosition(direction, finalPosition))
          draft.sort(compareOrder)
        })
      }
    },
    [height, arrLength, item.id, item.order, setItems]
  )

export default useMoveDraggableItem
