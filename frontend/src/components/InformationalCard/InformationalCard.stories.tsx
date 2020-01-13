import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import InformationalCard from "./InformationalCard"

export default {
  title: "Core|InformationalCard",
  component: InformationalCard,
  parameters: {
    componentSubtitle: "Just a simple InformationalCard",
  },
}

export const Basic: FC = () => (
  <InformationalCard
    buttonText="A button"
    onButtonClick={action("action click")}
    message="This is very useful do this."
  />
)
