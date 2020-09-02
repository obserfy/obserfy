import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import LinkInput from "./LinkInput"

export default {
  title: "Core|LinkInput",
  component: LinkInput,
  parameters: {
    componentSubtitle: "Just a simple LinkInput",
  },
}

export const Basic: FC = () => (
  <LinkInput
    isLoading={false}
    onChange={action("onChange")}
    onSave={action("onSave")}
  />
)
