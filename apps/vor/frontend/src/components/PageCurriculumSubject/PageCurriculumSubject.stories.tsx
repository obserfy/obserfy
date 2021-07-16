import { Meta, Story } from "@storybook/react"
import PageCurriculumSubject, {
  PageCurriculumSubjectProps,
} from "./PageCurriculumSubject"

export default {
  title: "Core/PageCurriculumSubject",
  component: PageCurriculumSubject,
  parameters: {
    componentSubtitle: "Just a simple PageCurriculumSubject",
  },
} as Meta

const Template: Story<PageCurriculumSubjectProps> = (args) => (
  <PageCurriculumSubject {...args} />
)

export const Default = Template.bind({})
Default.args = {}
