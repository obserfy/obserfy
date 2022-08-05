import { Meta, Story } from "@storybook/react"
import EditReportSideBar, { EditReportSideBarProps } from "./EditReportSideBar"

export default {
  title: "Core/EditReportSideBar",
  component: EditReportSideBar,
  parameters: {
    componentSubtitle: "Just a simple EditReportSideBar",
  },
} as Meta

const Template: Story<EditReportSideBarProps> = (args) => (
  <EditReportSideBar {...args} />
)

export const Default = Template.bind({})
Default.args = {}
