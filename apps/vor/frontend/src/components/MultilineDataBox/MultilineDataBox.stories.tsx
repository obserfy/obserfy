import React from "react"
import { Meta, Story } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import MultilineDataBox, { MultilineDataBoxProps } from "./MultilineDataBox"

export default {
  title: "Core/MultilineDataBox",
  component: MultilineDataBox,
  parameters: {
    componentSubtitle: "Just a simple MultilineDataBox",
  },
} as Meta

const Template: Story<MultilineDataBoxProps> = (args) => (
  <MultilineDataBox {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: "",
  value: "",
  onEditClick: action("edit clicked"),
  placeholder: "",
}
