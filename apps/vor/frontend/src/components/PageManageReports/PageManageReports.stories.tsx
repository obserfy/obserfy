import React from "react"
import { Meta, Story } from "@storybook/react"
import PageManageReports, { PageManageReportsProps } from "./PageManageReports"

export default {
  title: "Core/PageManageReports",
  component: PageManageReports,
  parameters: {
    componentSubtitle: "Just a simple PageManageReports",
  },
} as Meta

const Template: Story<PageManageReportsProps> = (args) => (
  <PageManageReports {...args} />
)

export const Default = Template.bind({})
Default.args = {}
