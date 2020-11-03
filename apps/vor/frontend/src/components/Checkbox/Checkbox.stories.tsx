import React from "react"
import { Meta, Story } from "@storybook/react"
import Checkbox, { CheckboxProps } from "./Checkbox"

export default {
  title: "Core/Checkbox",
  component: Checkbox,
  parameters: {
    componentSubtitle: "Just a simple Checkbox",
  },
} as Meta

const Template: Story<CheckboxProps> = (args) => <Checkbox {...args} />

export const Default = Template.bind({})
Default.args = {}
