import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DatePickerDialog from "./DatePickerDialog"

export default {
  title: "Basic|Dialog/DatePickerDialog",
  component: DatePickerDialog,
  parameters: {
    componentSubtitle: "Just a simple DatePickerDialog",
  },
}

export const Basic: FC = () => (
  <DatePickerDialog
    onConfirm={action("confirm")}
    onDismiss={action("dismiss")}
    defaultDate={new Date(2012, 2, 1)}
  />
)
