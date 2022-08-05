import { Meta, Story } from "@storybook/react"
import VideoPlayerDialog, { VideoPlayerDialogProps } from "./VideoPlayerDialog"

export default {
  title: "Core/VideoPlayerDialog",
  component: VideoPlayerDialog,
  parameters: {
    componentSubtitle: "Just a simple VideoPlayerDialog",
  },
} as Meta

const Template: Story<VideoPlayerDialogProps> = (args) => (
  <VideoPlayerDialog {...args} />
)

export const Default = Template.bind({})
Default.args = {}
