import { Meta, Story } from "@storybook/react"
import SimpleGuardiansSelector, {
  SimpleGuardiansSelectorProps,
} from "./SimpleGuardiansSelector"

export default {
  title: "Core/SimpleGuardiansSelector",
  component: SimpleGuardiansSelector,
  parameters: {
    componentSubtitle: "Just a simple SimpleGuardiansSelector",
  },
} as Meta

const Template: Story<SimpleGuardiansSelectorProps> = (args) => (
  <SimpleGuardiansSelector {...args} />
)

export const Default = Template.bind({})
Default.args = {}
