import React from "react"
import { Meta, Story } from "@storybook/react"
import ImagePreviewOverlay, {
  ImagePreviewOverlayProps,
} from "./ImagePreviewOverlay"

export default {
  title: "Core/ImagePreviewOverlay",
  component: ImagePreviewOverlay,
  parameters: {
    componentSubtitle: "Just a simple ImagePreviewOverlay",
  },
} as Meta

const Template: Story<ImagePreviewOverlayProps> = (args) => (
  <ImagePreviewOverlay {...args} />
)

export const Default = Template.bind({})
Default.args = {}
