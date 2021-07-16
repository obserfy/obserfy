import { Meta, Story } from "@storybook/react"
import PageCurriculumMaterial, {
  PageCurriculumMaterialProps,
} from "./PageCurriculumMaterial"

export default {
  title: "Core/PageCurriculumMaterial",
  component: PageCurriculumMaterial,
  parameters: {
    componentSubtitle: "Just a simple PageCurriculumMaterial",
  },
} as Meta

const Template: Story<PageCurriculumMaterialProps> = (args) => (
  <PageCurriculumMaterial {...args} />
)

export const Default = Template.bind({})
Default.args = {}
