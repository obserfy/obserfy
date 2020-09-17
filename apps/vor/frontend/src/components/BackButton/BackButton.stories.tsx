import React from "react"
import { Meta, Story } from "@storybook/react"
import BackButton, { BackButtonProps } from "./BackButton"

export default {
  title: "Core/BackButton",
  component: BackButton,
  parameters: {
    componentSubtitle: "Just a simple BackButton",
  },
} as Meta

const Template: Story<BackButtonProps> = () => <BackButton to="/" />

export const Default = Template.bind({})
Default.args = {}
