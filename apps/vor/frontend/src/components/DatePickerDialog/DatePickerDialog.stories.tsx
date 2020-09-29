import React from "react"
import { action } from "@storybook/addon-actions"
import { Meta, Story } from "@storybook/react"
import DatePickerDialog, { DatePickerDialogProps } from "./DatePickerDialog"
import dayjs from "../../dayjs"

export default {
  title: "Basic/Dialog/DatePickerDialog",
  component: DatePickerDialog,
  parameters: {
    componentSubtitle: "Just a simple DatePickerDialog",
  },
} as Meta

const Template: Story<DatePickerDialogProps> = ({ defaultDate }) => (
  <DatePickerDialog
    onConfirm={action("confirm")}
    onDismiss={action("dismiss")}
    defaultDate={defaultDate}
  />
)

export const Default = Template.bind({})
Default.args = {
  defaultDate: dayjs(new Date(2012, 1, 12)),
}
