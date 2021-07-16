import { Meta, Story } from "@storybook/react"
import PageAllReports, { PageAllReportsProps } from "./PageAllReports"

export default {
  title: "Core/PageAllReports",
  component: PageAllReports,
  parameters: {
    componentSubtitle: "Just a simple PageAllReports",
  },
} as Meta

const Template: Story<PageAllReportsProps> = (args) => (
  <PageAllReports {...args} />
)

export const Default = Template.bind({})
Default.args = {}
