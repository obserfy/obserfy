import React from "react"
import { Meta, Story } from "@storybook/react"
import DeleteCurriculumDialog, {
  DeleteCurriculumDialogProps,
} from "./DeleteCurriculumDialog"

export default {
  title: "Core/DeleteCurriculumDialog",
  component: DeleteCurriculumDialog,
  parameters: {
    componentSubtitle: "Just a simple DeleteCurriculumDialog",
  },
} as Meta

const Template: Story<DeleteCurriculumDialogProps> = () => (
  <DeleteCurriculumDialog />
)

export const Default = Template.bind({})
Default.args = {}
