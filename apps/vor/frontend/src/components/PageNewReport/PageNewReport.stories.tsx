import React from "react"
import { Meta, Story } from "@storybook/react"
import PageNewReport, { PageNewReportProps } from "./PageNewReport"

export default {
  title: "Core/PageNewReport",
  component: PageNewReport,
  parameters: {
    componentSubtitle: "Just a simple PageNewReport",
  },
} as Meta

const Template: Story<PageNewReportProps> = (args) => <PageNewReport {...args} />

export const Default = Template.bind({})
Default.args = {}