import { Meta, Story } from "@storybook/react"
import GuardianRelationshipSelector, {
  GuardianRelationshipSelectorProps,
} from "./GuardianRelationshipSelector"

export default {
  title: "Core/GuardianRelationshipSelector",
  component: GuardianRelationshipSelector,
  parameters: {
    componentSubtitle: "Just a simple GuardianRelationshipSelector",
  },
} as Meta

const Template: Story<GuardianRelationshipSelectorProps> = (args) => (
  <GuardianRelationshipSelector {...args} />
)

export const Default = Template.bind({})
Default.args = {}
