import { Meta, Story } from "@storybook/react"
import VideoPlayer, { VideoPlayerProps } from "./VideoPlayer"

export default {
  title: "Core/VideoPlayer",
  component: VideoPlayer,
  parameters: {
    componentSubtitle: "Just a simple VideoPlayer",
  },
} as Meta

const Template: Story<VideoPlayerProps> = (args) => <VideoPlayer {...args} />

export const Default = Template.bind({})
Default.args = {}
