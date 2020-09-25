import React from "react"
import { Meta, Story } from "@storybook/react"
import EditCurriculumDialog, { EditCurriculumDialogProps } from "./EditCurriculumDialog"

export default {
  title: "Core/EditCurriculumDialog",
  component: EditCurriculumDialog,
  parameters: {
    componentSubtitle: "Just a simple EditCurriculumDialog",
  },
} as Meta

const Template: Story<EditCurriculumDialogProps> = () => <EditCurriculumDialog />

export const Default = Template.bind({})
Default.args = {}
