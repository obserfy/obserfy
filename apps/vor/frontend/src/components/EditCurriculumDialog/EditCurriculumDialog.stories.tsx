import React from "react"
import { Meta, Story } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import EditCurriculumDialog, {
  EditCurriculumDialogProps,
} from "./EditCurriculumDialog"

export default {
  title: "Core/EditCurriculumDialog",
  component: EditCurriculumDialog,
  parameters: {
    componentSubtitle: "Just a simple EditCurriculumDialog",
  },
} as Meta

const Template: Story<EditCurriculumDialogProps> = (args) => (
  <EditCurriculumDialog {...args} />
)

export const Default = Template.bind({})
Default.args = {
  curriculumId: "",
  onDismiss: action("dismiss"),
}
