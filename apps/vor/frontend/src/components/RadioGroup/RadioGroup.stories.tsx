import { Meta, Story } from "@storybook/react"
import RadioGroup, { RadioGroupsProps } from "./RadioGroup"

export default {
  title: "Core/RadioGroup",
  component: RadioGroup,
  parameters: {
    componentSubtitle: "Just a simple RadioGroups",
  },
} as Meta

const Template: Story<RadioGroupsProps> = (args) => <RadioGroup {...args} />

export const Default = Template.bind({})
Default.args = {}
