import React, { FC, useEffect } from "react"
import { Global } from "@emotion/core"
import Card from "../Card/Card"
import { Flex } from "../Flex/Flex"
import { BoxProps } from "../Box/Box"
import Portal from "../Portal/Portal"

function disableScroll(e: TouchEvent): boolean {
  e.preventDefault()
  return false
}

interface Props extends BoxProps {
  visible?: boolean
}
export const Dialog: FC<Props> = ({ sx, ...props }) => {
  // disable scroll on iOS.
  useEffect(() => {
    document.body.addEventListener("touchmove", disableScroll)
    return () => {
      document.body.removeEventListener("touchmove", disableScroll)
    }
  })

  return (
    <Portal>
      <Flex
        as="dialog"
        role="dialog"
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
          maxWidth="maxWidth.xsm"
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
    </Portal>
  )
}

const GlobalStyle: FC = () => (
  <Global styles={{ body: { overflow: "hidden" } }} />
)

export default Dialog
