import React, { FC, memo, useCallback } from "react"
import { Button } from "theme-ui"
import { Material } from "../../api/useGetSubjectMaterials"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import DraggableListItem from "../DraggableListItem/DraggableListItem"

interface Props {
  material: Material
  autofocus: boolean
  height: number
  i: number
  setMaterials: (f: (draft: Material[]) => void) => void
  length: number
}
export const DraggableMaterialListItem: FC<Props> = ({
  material,
  length,
  setMaterials,
  i,
  autofocus,
  height,
}) => {
  const onNameChange = useCallback(
    (e) => {
      const name = e.target.value
      setMaterials((draft) => {
        draft[i].name = name
      })
    },
    [i, setMaterials]
  )

  const onDelete = useCallback(() => {
    setMaterials((draft) => {
      const newMaterial = draft
        .filter(({ id }) => id !== material.id) // Remove material
        .map((current) =>
          // Fix order number so none are skipped (1,2,3,4 not 1,3,4,5)
          current.order > material.order
            ? { ...current, order: current.order - 1 }
            : current
        )
      newMaterial.sort((a, b) => a.order - b.order)
      return newMaterial
    })
  }, [material.id, material.order, setMaterials])

  const moveItem = useCallback(
    (order, offset, originalOrder) => {
      // Calculate position inside the list while being dragged
      let position: number
      if (offset < 0) {
        position = Math.ceil((offset - height / 2) / height)
      } else {
        position = Math.floor((offset + height / 2) / height)
      }

      // Reorder list to reflect position after dragging
      if (originalOrder + position > order) {
        const newPosition = Math.min(originalOrder + position, length - 1)
        if (material.order !== newPosition)
          setMaterials((draft) => {
            draft.forEach((item, idx) => {
              if (item.id === material.id) {
                // eslint-disable-next-line no-param-reassign
                item.order = newPosition
              } else if (item.order === newPosition) {
                // eslint-disable-next-line no-param-reassign
                item.order -= 1
              } else {
                // eslint-disable-next-line no-param-reassign
                item.order = idx
              }
            })
            draft.sort((a, b) => a.order - b.order)
          })
      }
      if (originalOrder + position < order) {
        if (material.order !== originalOrder + position)
          setMaterials((draft) => {
            const newPosition = Math.max(originalOrder + position, 0)
            draft.forEach((item, idx) => {
              if (item.id === material.id) {
                // eslint-disable-next-line no-param-reassign
                item.order = newPosition
              } else if (item.order === newPosition) {
                // eslint-disable-next-line no-param-reassign
                item.order += 1
              } else {
                // eslint-disable-next-line no-param-reassign
                item.order = idx
              }
            })
            draft.sort((a, b) => a.order - b.order)
          })
        return -1
      }
      return 0
    },
    [height, length, material.id, material.order, setMaterials]
  )

  return (
    <DraggableListItem
      height={height}
      order={material.order}
      moveItem={moveItem}
    >
      <Input
        data-cy={
          material.name === "" ? "materialNameInputEmpty" : "materialNameInput"
        }
        placeholder="Material name"
        p={0}
        value={material.name}
        onChange={onNameChange}
        backgroundColor="transparent"
        autoFocus={autofocus}
        sx={{
          width: "100%",
          fontSize: [2, 1],
          p: 0,
          pl: 2,
          border: "none",
          height: "100%",
        }}
      />
      <Button mr={2} variant="secondary" onClick={onDelete}>
        <Icon as={DeleteIcon} />
      </Button>
    </DraggableListItem>
  )
}

export default memo(DraggableMaterialListItem)
