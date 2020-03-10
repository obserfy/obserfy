import React, { FC } from "react"
import { Global } from "@emotion/core"
import Card from "../Card/Card"
import { Flex } from "../Flex/Flex"
import { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
  visible?: boolean
}
export const Dialog: FC<Props> = ({ sx, ...props }) => (
  <Flex
    as="dialog"
    flexDirection="column-reverse"
    alignItems={["", "center"]}
    justifyContent={["", "center"]}
    backgroundColor="overlay"
    width="100%"
    height="100%"
    p={[0, 3]}
    sx={{
      border: "none",
      top: 0,
      left: 0,
      zIndex: 1000001,
      position: "fixed",
    }}
  >
    <Card
      backgroundColor="surface"
      maxWidth="maxWidth.sm"
      width="100%"
      maxHeight="100vh"
      pb="env(safe-area-inset-bottom)"
      sx={{
        ...sx,
        borderTopLeftRadius: "default",
        borderTopRightRadius: "default",
        borderBottomLeftRadius: [0, "default"],
        borderBottomRightRadius: [0, "default"],
      }}
      {...props}
    />
    <GlobalStyle />
  </Flex>
)

const GlobalStyle: FC = () => (
  <Global styles={{ body: { overflow: "hidden" } }} />
)

export default Dialog
