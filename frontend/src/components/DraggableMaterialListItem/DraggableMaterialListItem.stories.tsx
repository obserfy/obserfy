import React, { FC } from "react"
import nanoid from "nanoid"
import { action } from "@storybook/addon-actions"
import * as faker from "faker"
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
    { order: 0, id: nanoid(), name: faker.name.firstName() },
    { order: 1, id: nanoid(), name: faker.name.firstName() },
    { order: 2, id: nanoid(), name: faker.name.firstName() },
    { order: 3, id: nanoid(), name: faker.name.firstName() },
    { order: 4, id: nanoid(), name: faker.name.firstName() },
    { order: 5, id: nanoid(), name: faker.name.firstName() },
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
