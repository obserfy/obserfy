import React, { FC } from "react"
import InformationalCard from "./InformationalCard"

export default {
  title: "Basic|Card/InformationalCard",
  component: InformationalCard,
  parameters: {
    componentSubtitle: "Just a simple InformationalCard",
  },
}

export const Basic: FC = () => (
  <InformationalCard
    buttonText="A button"
    to="/"
    message="This is very useful do this."
  />
)
