import { Meta, Story } from "@storybook/react"
import MarkdownEditor, { MarkdownEditorProps } from "./MarkdownEditor"

export default {
  title: "Core/MarkdownEditor",
  component: MarkdownEditor,
  parameters: {
    componentSubtitle: "Just a simple MarkdownEditor",
  },
} as Meta

const Template: Story<MarkdownEditorProps> = (args) => (
  <MarkdownEditor {...args} />
)

export const Default = Template.bind({})
Default.args = {}
