import React from "react"
import { Meta, Story } from "@storybook/react"
import Breadcrumb, { BreadcrumbProps } from "./Breadcrumb"
import BreadcrumbItem from "./BreadcrumbItem"

export default {
  title: "Core/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    componentSubtitle: "Just a simple Breadcrumb",
  },
} as Meta

const Template: Story<BreadcrumbProps> = () => (
  <Breadcrumb>
    <BreadcrumbItem to="/">Students</BreadcrumbItem>
    <BreadcrumbItem to="/">Joyce</BreadcrumbItem>
    <BreadcrumbItem to="/">Observations</BreadcrumbItem>
  </Breadcrumb>
)

export const Default = Template.bind({})
Default.args = {
  sx: {},
}
