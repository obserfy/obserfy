import { Meta, Story } from "@storybook/react"
import CurriculumTopBar, { CurriculumTopBarProps } from "./CurriculumTopBar"

export default {
  title: "Core/CurriculumTopBar",
  component: CurriculumTopBar,
  parameters: {
    componentSubtitle: "Just a simple CurriculumTopBar",
  },
} as Meta

const Template: Story<CurriculumTopBarProps> = (args) => (
  <CurriculumTopBar {...args} />
)

export const Default = Template.bind({})
Default.args = {}
