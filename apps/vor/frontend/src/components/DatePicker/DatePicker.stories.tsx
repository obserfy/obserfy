import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DatePicker from "./DatePicker"
import dayjs from "../../dayjs"

export default {
  title: "Core|DatePicker",
  component: DatePicker,
  parameters: {
    componentSubtitle: "Just a simple DatePicker",
  },
}

export const Basic: FC = () => (
  <DatePicker onChange={action("change")} value={dayjs(0)} />
)
