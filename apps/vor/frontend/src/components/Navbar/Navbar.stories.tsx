import React, { FC } from "react"
import Navbar from "./Navbar"

export default {
  title: "Core|Navbar",
  component: Navbar,
  parameters: {
    componentSubtitle: "Just a simple Navbar",
  },
}

export const Basic: FC = () => <Navbar />
