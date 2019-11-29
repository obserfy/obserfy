import React, { FC } from "react"
import { knob } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"
import { Typography } from "../Typography/Typography"
import SideBar from "./SideBar"
import Box from "../Box/Box"
import Flex from "../Flex/Flex"

export default {
  title: "Basic|Navigation/SideBar",
  component: SideBar,
  parameters: {
    componentSubtitle: "Just a simple SideBar"
  }
}

export const Basic: FC = () => (
  <Box backgroundColor="background" width="100%">
    <SideBar
      onOutsideClick={action("Clicked outside sidebar")}
      isShown={knob("Show sidebar", { type: "boolean", value: true })}
    >
      <Flex p={3}>
        <Typography.H6>A Sidebar is Present</Typography.H6>
      </Flex>
    </SideBar>
  </Box>
)
