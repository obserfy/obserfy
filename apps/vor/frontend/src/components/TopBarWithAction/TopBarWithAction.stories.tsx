import { Meta, Story } from "@storybook/react"
import TopBarWithAction, { TopBarWithActionProps } from "./TopBarWithAction"

export default {
  title: "Core/TopBarWithAction",
  component: TopBarWithAction,
  parameters: {
    componentSubtitle: "Just a simple TopBarWithAction",
  },
} as Meta

const Template: Story<TopBarWithActionProps> = (args) => (
  <TopBarWithAction {...args} />
)

export const Default = Template.bind({})
Default.args = {
  breadcrumbs: [],
}
