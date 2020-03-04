import React, { FC } from "react"
import nanoid from "nanoid"
import { action } from "@storybook/addon-actions"
import DraggableMaterialListItem from "./DraggableMaterialListItem"
import { Material } from "../../api/useGetSubjectMaterials"

export default {
  title: "Core|DraggableMaterialListItem",
  component: DraggableMaterialListItem,
  parameters: {
    componentSubtitle: "Just a simple DraggableMaterialListItem",
  },
}

export const Basic: FC = () => {
  const materials: Material[] = [
    { order: 0, id: nanoid(), name: "Johnny" },
    { order: 1, id: nanoid(), name: "Draper" },
    { order: 2, id: nanoid(), name: "Thera" },
    { order: 3, id: nanoid(), name: "Sissy" },
    { order: 4, id: nanoid(), name: "Conny" },
    { order: 5, id: nanoid(), name: "Sloppy" },
  ]
  return (
    <DraggableMaterialListItem
      autofocus
      height={48}
      material={materials[0]}
      length={materials.length}
      setMaterials={action("Set Materials")}
      i={0}
    />
  )
}
