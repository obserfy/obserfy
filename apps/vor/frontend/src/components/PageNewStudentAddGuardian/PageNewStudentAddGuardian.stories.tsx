import { Meta, Story } from "@storybook/react"
import PageNewStudentAddGuardian from "./PageNewStudentAddGuardian"

export default {
  title: "Core/PageNewStudentAddGuardian",
  component: PageNewStudentAddGuardian,
  parameters: {
    componentSubtitle: "Just a simple PageNewStudentAddGuardian",
  },
} as Meta

const Template: Story<{}> = (args) => <PageNewStudentAddGuardian {...args} />

export const Default = Template.bind({})
Default.args = {}
