import { Meta, Story } from "@storybook/react"
import Chatwoot, { ChatwootProps } from "./Chatwoot"

export default {
  title: "Core/Chatwoot",
  component: Chatwoot,
  parameters: {
    componentSubtitle: "Just a simple Chatwoot",
  },
} as Meta

const Template: Story<ChatwootProps> = (args) => <Chatwoot {...args} />

export const Default = Template.bind({})
Default.args = {}
