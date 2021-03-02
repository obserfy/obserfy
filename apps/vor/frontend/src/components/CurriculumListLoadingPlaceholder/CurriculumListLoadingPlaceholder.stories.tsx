import React from "react"
import { Meta, Story } from "@storybook/react"
import CurriculumListLoadingPlaceholder, { CurriculumListLoadingPlaceholderProps } from "./CurriculumListLoadingPlaceholder"

export default {
  title: "Core/CurriculumListLoadingPlaceholder",
  component: CurriculumListLoadingPlaceholder,
  parameters: {
    componentSubtitle: "Just a simple CurriculumListLoadingPlaceholder",
  },
} as Meta

const Template: Story<CurriculumListLoadingPlaceholderProps> = (args) => <CurriculumListLoadingPlaceholder {...args} />

export const Default = Template.bind({})
Default.args = {}
