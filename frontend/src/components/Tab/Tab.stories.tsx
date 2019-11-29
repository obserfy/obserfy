import React, { FC, useState } from "react"

import Tab from "./Tab"
import Box from "../Box/Box"

export default {
  title: "Basic|Tab",
  component: Tab,
  parameters: {
    componentSubtitle: "Just a simple Tab"
  }
}

export const Basic: FC = () => {
  const [selectedItemIdx, setSelectedItem] = useState(0)
  return (
    <Box backgroundColor="background">
      <Tab
        onTabClick={setSelectedItem}
        selectedItemIdx={selectedItemIdx}
        items={["Tab 1", "Tab 2", "Tab 3"]}
      />
    </Box>
  )
}
