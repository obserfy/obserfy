---
to: src/components/<%= name%>/<%= name%>.stories.tsx
---
import React from "react"
import { Meta, Story } from "@storybook/react"
import <%= name %>, { <%= name%>Props } from "./<%= name %>"

export default {
  title: "Core/<%= name %>",
  component: <%= name %>,
  parameters: {
    componentSubtitle: "Just a simple <%= name %>",
  },
} as Meta

const Template: Story<<%= name%>Props> = (args) => <<%= name%> {...args} />

export const Default = Template.bind({})
Default.args = {}
