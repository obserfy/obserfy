import React from "react"
import { Meta, Story } from "@storybook/react"
import PageEditObservation, {
  PageEditObservationProps,
} from "./PageEditObservation"

export default {
  title: "Core/PageEditObservation",
  component: PageEditObservation,
  parameters: {
    componentSubtitle: "Just a simple PageEditObservation",
  },
} as Meta

const Template: Story<PageEditObservationProps> = ({
  observationId,
  studentId,
}) => (
  <PageEditObservation observationId={observationId} studentId={studentId} />
)

export const Default = Template.bind({})
Default.args = {
  observationId: "",
  studentId: "",
}
