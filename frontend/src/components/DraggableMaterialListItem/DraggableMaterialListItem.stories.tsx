import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import nanoid from "nanoid"
import DraggableMaterialListItem from "./DraggableMaterialListItem"

export default {
  title: "Core|DraggableMaterialListItem",
  component: DraggableMaterialListItem,
  parameters: {
    componentSubtitle: "Just a simple DraggableMaterialListItem",
  },
}

export const Basic: FC = () => (
  <DraggableMaterialListItem
    autofocus
    moveItem={action("move item")}
    height={48}
    material={{
      order: 1,
      name: "Eyafallajokul",
      id: nanoid(),
    }}
    onNameChange={action("nameChanged")}
    onDelete={action("delete")}
  />
)
