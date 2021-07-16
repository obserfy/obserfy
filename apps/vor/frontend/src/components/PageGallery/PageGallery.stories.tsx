import { Meta, Story } from "@storybook/react"
import PageGallery, { PageGalleryProps } from "./PageGallery"

export default {
  title: "Core/PageGallery",
  component: PageGallery,
  parameters: {
    componentSubtitle: "Just a simple PageGallery",
  },
} as Meta

const Template: Story<PageGalleryProps> = (args) => <PageGallery {...args} />

export const Default = Template.bind({})
Default.args = {}
