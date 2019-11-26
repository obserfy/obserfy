import React, { FC } from "react"
import SearchBar from "./SearchBar"

export default {
  title: "Basic|SearchBar",
  component: SearchBar,
  parameters: {
    componentSubtitle: "Just a simple SearchBar"
  }
}

export const Basic: FC = () => <SearchBar />
