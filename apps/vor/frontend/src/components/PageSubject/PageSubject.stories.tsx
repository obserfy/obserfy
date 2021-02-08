import React from "react"
import { Meta, Story } from "@storybook/react"
import PageSubject, { PageSubjectProps } from "./PageSubject"

export default {
  title: "Core/PageSubject",
  component: PageSubject,
  parameters: {
    componentSubtitle: "Just a simple PageSubject",
  },
} as Meta

const Template: Story<PageSubjectProps> = (args) => <PageSubject {...args} />

export const Default = Template.bind({})
Default.args = {}
