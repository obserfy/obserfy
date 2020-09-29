import React from "react"
import { Meta, Story } from "@storybook/react"
import ImagePreview, { ImagePreviewProps } from "./ImagePreview"

export default {
  title: "Core/ImagePreview",
  component: ImagePreview,
  parameters: {
    componentSubtitle: "Just a simple ImagePreview",
  },
} as Meta

const Template: Story<ImagePreviewProps> = (args) => <ImagePreview {...args} />

export const Default = Template.bind({})
Default.args = {
  id: "",
  originalUrl: "",
  thumbnailUrl: "",
}
