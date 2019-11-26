import React, { FC } from "react"

import Dialog from "./Dialog"
import { Typography } from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import Flex from "../Flex/Flex"

export default {
  title: "Basic|Dialog/Dialog",
  component: Dialog,
  parameters: {
    componentSubtitle: "Just a simple Dialog"
  }
}

export const Basic: FC = () => (
  <Dialog p={3}>
    <Typography.H6>You have unsaved changes</Typography.H6>
    <Flex>
      <Spacer />
      <Button variant="outline" mr={3}>
        Cancel
      </Button>
      <Button>Exit</Button>
    </Flex>
  </Dialog>
)
