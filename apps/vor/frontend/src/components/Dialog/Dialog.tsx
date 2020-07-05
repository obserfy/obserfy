import React, { FC, PropsWithoutRef, useEffect } from "react"
import { Global } from "@emotion/core"
import { BoxProps, Card, Flex } from "theme-ui"
import Portal from "../Portal/Portal"

function disableScroll(e: TouchEvent): boolean {
  e.preventDefault()
  return false
}

interface Props extends PropsWithoutRef<BoxProps> {
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
        backgroundColor="overlay"
        p={[0, 3]}
        sx={{
          height: "100%",
          width: "100%",
          justifyContent: ["", "center"],
          flexDirection: "column-reverse",
          alignItems: ["", "center"],
          border: "none",
          top: 0,
          left: 0,
          zIndex: 1000001,
          position: "fixed",
        }}
      >
        <Card
          backgroundColor="surface"
          pb="env(safe-area-inset-bottom)"
          sx={{
            ...sx,
            maxHeight: "100vh",
            width: "100%",
            maxWidth: "maxWidth.xsm",
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
