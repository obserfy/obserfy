import React from "react"
import { Meta, Story } from "@storybook/react"
import PageNewStudentAddGuardian, { PageNewStudentAddGuardianProps } from "./PageNewStudentAddGuardian"

export default {
  title: "Core/PageNewStudentAddGuardian",
  component: PageNewStudentAddGuardian,
  parameters: {
    componentSubtitle: "Just a simple PageNewStudentAddGuardian",
  },
} as Meta

const Template: Story<PageNewStudentAddGuardianProps> = (args) => <PageNewStudentAddGuardian {...args} />

export const Default = Template.bind({})
Default.args = {}
