import { Meta, Story } from "@storybook/react"
import StudentsInReport, { PageManageReportsProps } from "./StudentsInReport"

export default {
  title: "Core/PageManageReports",
  component: StudentsInReport,
  parameters: {
    componentSubtitle: "Just a simple PageManageReports",
  },
} as Meta

const Template: Story<PageManageReportsProps> = (args) => (
  <StudentsInReport {...args} />
)

export const Default = Template.bind({})
Default.args = {}
