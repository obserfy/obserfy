import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import ProfilePicker from "./ProfilePicker"
import Box from "../Box/Box"

export default {
  title: "Core|ProfilePicker",
  component: ProfilePicker,
  parameters: {
    componentSubtitle: "Just a simple ProfilePicker",
  },
}

export const Basic: FC = () => (
  <Box m={3}>
    <ProfilePicker onChange={action("changed")} />
  </Box>
)
