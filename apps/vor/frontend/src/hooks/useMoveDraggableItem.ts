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
      const reorderItem = (direction: number, newOrder: number) => (
        m: Material,
        idx: number
      ) => {
        if (m.id === item.id) {
          // eslint-disable-next-line no-param-reassign
          m.order = newOrder
        } else if (m.order === newOrder) {
          // eslint-disable-next-line no-param-reassign
          m.order += direction
        } else {
          // eslint-disable-next-line no-param-reassign
          m.order = idx
        }
      }

      // Calculate position inside the list while being dragged
      let position: number
      if (offset < 0) {
        position = Math.ceil((offset - height / 2) / height)
      } else {
        position = Math.floor((offset + height / 2) / height)
      }
      const newPosition = originalOrder + position

      // Reorder list to reflect position after dragging
      if (newPosition < currOrder) {
        const finalPosition = Math.max(newPosition, 0)
        if (item.order !== finalPosition)
          setItems((draft) => {
            draft.forEach(reorderItem(1, finalPosition))
            draft.sort(compareOrder)
          })
        return -1
      }
      if (newPosition > currOrder) {
        const finalPosition = Math.min(newPosition, arrLength - 1)
        if (item.order !== finalPosition)
          setItems((draft) => {
            draft.forEach(reorderItem(-1, finalPosition))
            draft.sort(compareOrder)
          })
      }
      return 0
    },
    [height, arrLength, item.id, item.order, setItems]
  )

export default useMoveDraggableItem
