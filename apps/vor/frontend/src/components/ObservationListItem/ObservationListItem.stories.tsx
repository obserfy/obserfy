import { Meta, Story } from "@storybook/react"
import ObservationListItem, {
  ObservationListItemProps,
} from "./ObservationListItem"

export default {
  title: "Core/ObservationListItem",
  component: ObservationListItem,
  parameters: {
    componentSubtitle: "Just a simple ObservationListItem",
  },
} as Meta

const Template: Story<ObservationListItemProps> = (args) => (
  <ObservationListItem {...args} />
)

export const Default = Template.bind({})
Default.args = {}
