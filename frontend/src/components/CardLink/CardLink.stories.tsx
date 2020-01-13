import React, { FC } from "react"
import CardLink from "./CardLink"

export default {
  title: "Core|CardLink",
  component: CardLink,
  parameters: {
    componentSubtitle: "Just a simple CardLink",
  },
}

export const Basic: FC = () => <CardLink name="Curriculum" to="/curriculum" />
