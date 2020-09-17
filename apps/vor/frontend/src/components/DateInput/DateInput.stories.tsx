import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DateInput from "./DateInput"

export default {
  title: "Core/DateInput",
  component: DateInput,
  parameters: {
    componentSubtitle: "Just a simple DateInput",
  },
}

export const Basic: FC = () => <DateInput onChange={action("date changed")} />
