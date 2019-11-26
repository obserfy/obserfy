import React, { FC } from "react"

import Card from "../Card/Card"
import { Flex } from "../Flex/Flex"
import { BoxProps } from "../Box/Box"

export const Dialog: FC<BoxProps> = props => (
  <Flex
    flexDirection="column-reverse"
    alignItems={["", "center"]}
    justifyContent={["", "center"]}
    backgroundColor="overlay"
    width="100%"
    height="100%"
    p={[0, 3]}
    sx={{ top: 0, left: 0, zIndex: 200, position: "fixed" }}
  >
    <Card
      backgroundColor="surface"
      maxWidth="maxWidth.sm"
      width="100%"
      borderRadius={[0, "default"]}
      {...props}
    />
  </Flex>
)

export default Dialog
