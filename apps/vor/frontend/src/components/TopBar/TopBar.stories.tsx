import React from "react"
import { Meta, Story } from "@storybook/react"
import TopBar, { TopBarProps } from "./TopBar"

export default {
  title: "Core/TopBar",
  component: TopBar,
  parameters: {
    componentSubtitle: "Just a simple TopBar",
  },
} as Meta

const Template: Story<TopBarProps> = ({ breadcrumbs }) => (
  <TopBar breadcrumbs={breadcrumbs} />
)

export const Default = Template.bind({})
Default.args = {
  breadcrumbs: [{ to: "/", text: "oblivion" }],
}
