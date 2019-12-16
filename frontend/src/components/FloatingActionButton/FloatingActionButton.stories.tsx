import React, { FC } from "react"
import FloatingActionButton from "./FloatingActionButton"

export default {
  title: "Core|FloatingActionButton",
  component: FloatingActionButton,
  parameters: {
    componentSubtitle: "Just a simple FloatingActionButton",
  },
}

export const Basic: FC = () => <FloatingActionButton />
