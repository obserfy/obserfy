import { Meta, Story } from "@storybook/react"
import PagePaymentSuccess, {
  PagePaymentSuccessProps,
} from "./PagePaymentSuccess"

export default {
  title: "Core/PagePaymentSuccess",
  component: PagePaymentSuccess,
  parameters: {
    componentSubtitle: "Just a simple PagePaymentSuccess",
  },
} as Meta

const Template: Story<PagePaymentSuccessProps> = (args) => (
  <PagePaymentSuccess {...args} />
)

export const Default = Template.bind({})
Default.args = {}
