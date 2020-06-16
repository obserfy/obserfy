import React, { FC } from "react"
import { Box } from "theme-ui"
import ToggleButton from "./ToggleButton"

export default {
  title: "Basic|ToggleButton",
  component: ToggleButton,
  parameters: {
    componentSubtitle: "Just a simple ToggleButton",
  },
}

export const Basic: FC = () => (
  <Box p={2} backgroundColor="white">
    <ToggleButton values={["Daily", "Weekly", "Monthly"]} selectedItemIdx={0} />
  </Box>
)
