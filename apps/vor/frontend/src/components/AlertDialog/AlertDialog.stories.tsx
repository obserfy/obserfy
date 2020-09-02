import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import { Box } from "theme-ui"
import AlertDialog from "./AlertDialog"

export default {
  title: "Basic/Dialog/AlertDialog",
  component: AlertDialog,
  parameters: {
    componentSubtitle: "Just a simple AlertDialog",
  },
}

export const Basic: FC = () => (
  <Box sx={{ height: "100vh", minHeight: 600, transform: "scale(1)" }}>
    <AlertDialog
      positiveText="Yes, please"
      negativeText="No, spare him"
      title="Kill shepard?"
      body="Killing shepard will have rippling effect across the world, continue?"
      onNegativeClick={action("Shepard spared")}
      onDismiss={action("dismissed")}
      onPositiveClick={action("Shepard killed")}
    />
  </Box>
)
