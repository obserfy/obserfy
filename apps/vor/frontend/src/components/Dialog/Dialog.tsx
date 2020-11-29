import React, { FC, PropsWithoutRef, useLayoutEffect, useRef } from "react"
import { keyframes } from "@emotion/react"
import { Box, BoxProps, Card, Flex } from "theme-ui"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import Portal from "../Portal/Portal"

const dialogEnterAnim = keyframes(`
  0% {
    transform: translateY(64px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`)

const bgEnterAnim = keyframes(`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`)

interface Props extends PropsWithoutRef<BoxProps> {
  visible?: boolean
}
export const Dialog: FC<Props> = ({ sx, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current, {
        reserveScrollBarGap: true,
        allowTouchMove: (el) => el.tagName === "TEXTAREA",
      })
    }
    return () => {
      if (ref.current) enableBodyScroll(ref.current)
    }
  }, [])

  return (
    <Portal>
      <Flex
        as="dialog"
        role="dialog"
        p={[0, 3]}
        sx={{
          background: "transparent",
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
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "overlay",
            width: "100%",
            height: "100%",
            zIndex: 1000002,
            animation: `${bgEnterAnim} 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);`,
          }}
        />
        <Card
          backgroundColor="surface"
          pb="env(safe-area-inset-bottom)"
          ref={ref}
          sx={{
            maxHeight: "100vh",
            width: "100%",
            maxWidth: "maxWidth.xsm",
            borderTopLeftRadius: "default",
            borderTopRightRadius: "default",
            borderBottomLeftRadius: [0, "default"],
            borderBottomRightRadius: [0, "default"],
            animation: `${dialogEnterAnim} 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);`,
            zIndex: 1000003,
            ...sx,
          }}
          {...props}
        />
      </Flex>
    </Portal>
  )
}

export default Dialog
