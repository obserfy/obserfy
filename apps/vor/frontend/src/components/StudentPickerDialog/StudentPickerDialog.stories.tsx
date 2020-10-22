import React from "react"
import { Meta, Story } from "@storybook/react"
import StudentPickerDialog, { StudentPickerDialogProps } from "./StudentPickerDialog"

export default {
  title: "Core/StudentPickerDialog",
  component: StudentPickerDialog,
  parameters: {
    componentSubtitle: "Just a simple StudentPickerDialog",
  },
} as Meta

const Template: Story<StudentPickerDialogProps> = (args) => <StudentPickerDialog {...args} />

export const Default = Template.bind({})
Default.args = {}
