import React, { FC } from "react"
import { boolean } from "@storybook/addon-knobs"
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
    isLoading={boolean("loading", false)}
    onChange={action("onChange")}
    onSave={action("onSave")}
  />
)
