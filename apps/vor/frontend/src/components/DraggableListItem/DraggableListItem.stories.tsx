import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DraggableListItem from "./DraggableListItem"

export default {
  title: "Core/DraggableListItem",
  component: DraggableListItem,
  parameters: {
    componentSubtitle: "Just a simple DraggableListItem",
  },
}

export const Basic: FC = () => (
  <DraggableListItem height={48} moveItem={action("move item")} order={1} />
)
