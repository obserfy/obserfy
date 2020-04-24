import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import EmptyListPlaceholder from "./EmptyListPlaceholder"

export default {
  title: "Core|EmptyListPlaceholder",
  component: EmptyListPlaceholder,
  parameters: {
    componentSubtitle: "Just a simple EmptyListPlaceholder",
  },
}

export const Basic: FC = () => (
  <EmptyListPlaceholder
    callToActionText="Add new"
    onActionClick={action("Add new")}
    text="List is still empty"
  />
)
