import { Meta, Story } from "@storybook/react"
import NewGuardianForm, { NewGuardianFormProps } from "./NewGuardianForm"

export default {
  title: "Core/NewGuardianForm",
  component: NewGuardianForm,
  parameters: {
    componentSubtitle: "Just a simple NewGuardianForm",
  },
} as Meta

const Template: Story<NewGuardianFormProps> = (args) => (
  <NewGuardianForm {...args} />
)

export const Default = Template.bind({})
Default.args = {}
