import React from "react"
import { Meta, Story } from "@storybook/react"
import NewCustomCurriculumDialog, {
  NewCustomCurriculumDialogProps,
} from "./NewCustomCurriculumDialog"

export default {
  title: "Core/NewCustomCurriculumDialog",
  component: NewCustomCurriculumDialog,
  parameters: {
    componentSubtitle: "Just a simple NewCustomCurriculumDialog",
  },
} as Meta

const Template: Story<NewCustomCurriculumDialogProps> = (args) => (
  <NewCustomCurriculumDialog {...args} />
)

export const Default = Template.bind({})
Default.args = {}
