import React, { ChangeEventHandler, FC } from "react"
import { Material } from "../../api/useGetSubjectMaterials"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import DraggableListItem from "../DraggableListItem/DraggableListItem"

interface Props {
  material: Material
  moveItem: (order: number, offset: number, originalOrder: number) => void
  onDelete: () => void
  onNameChange: ChangeEventHandler<HTMLInputElement>
  autofocus: boolean
  height: number
}
export const DraggableMaterialListItem: FC<Props> = ({
  material,
  moveItem,
  onDelete,
  onNameChange,
  autofocus,
  height,
}) => (
  <DraggableListItem height={height} order={material.order} moveItem={moveItem}>
    <Input
      placeholder="Material name"
      p={0}
      width="100%"
      value={material.name}
      onChange={onNameChange}
      backgroundColor="transparent"
      autoFocus={autofocus}
      sx={{
        fontSize: [2, 1],
        p: 0,
        pl: 2,
        border: "none",
        height: "100%",
      }}
    />
    <Button mr={2} variant="secondary" onClick={onDelete}>
      <Icon as={DeleteIcon} m={0} />
    </Button>
  </DraggableListItem>
)

export default DraggableMaterialListItem
