import { Meta, Story } from "@storybook/react"
import PageSchoolProfile, { PageSchoolProfileProps } from "./PageSchoolProfile"

export default {
  title: "Core/PageSchoolProfile",
  component: PageSchoolProfile,
  parameters: {
    componentSubtitle: "Just a simple PageSchoolProfile",
  },
} as Meta

const Template: Story<PageSchoolProfileProps> = (args) => (
  <PageSchoolProfile {...args} />
)

export const Default = Template.bind({})
Default.args = {}
