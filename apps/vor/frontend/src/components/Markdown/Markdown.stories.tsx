import { Meta, Story } from "@storybook/react"
import Markdown, { MarkdownProps } from "./Markdown"

export default {
  title: "Core/Markdown",
  component: Markdown,
  parameters: {
    componentSubtitle: "Just a simple Markdown",
  },
} as Meta

const Template: Story<MarkdownProps> = (args) => <Markdown {...args} />

export const Default = Template.bind({})
Default.args = {}
