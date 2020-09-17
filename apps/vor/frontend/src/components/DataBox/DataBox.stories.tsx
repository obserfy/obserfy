import React from "react"
import { Meta, Story } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import DataBox, { DataBoxProps } from "./DataBox"

export default {
  title: "Core/DataBox",
  component: DataBox,
  parameters: {
    componentSubtitle: "Just a simple DataBox",
  },
} as Meta

const Template: Story<DataBoxProps> = (args) => <DataBox {...args} />

export const Default = Template.bind({})
Default.args = {
  isEditing: false,
  label: "",
  onEditClick: action("edit clicked"),
  value: "",
}
