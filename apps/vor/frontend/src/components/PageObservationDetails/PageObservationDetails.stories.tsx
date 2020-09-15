import React from "react"
import { Meta, Story } from "@storybook/react"
import PageObservationDetails, {
  PageObservationDetailsProps,
} from "./PageObservationDetails"

export default {
  title: "Core/PageObservationDetails",
  component: PageObservationDetails,
  parameters: {
    componentSubtitle: "Just a simple PageObservationDetails",
  },
} as Meta

const Template: Story<PageObservationDetailsProps> = () => (
  <PageObservationDetails observationId="" />
)

export const Default = Template.bind({})
Default.args = {}
