import React from "react"
import { Meta, Story } from "@storybook/react"
import PageStudentReport, { PageStudentReportProps } from "./PageStudentReport"

export default {
  title: "Core/PageStudentReport",
  component: PageStudentReport,
  parameters: {
    componentSubtitle: "Just a simple PageStudentReport",
  },
} as Meta

const Template: Story<PageStudentReportProps> = (args) => (
  <PageStudentReport {...args} />
)

export const Default = Template.bind({})
Default.args = {}
