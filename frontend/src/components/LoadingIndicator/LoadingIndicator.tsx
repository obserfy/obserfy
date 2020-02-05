import React, { FC } from "react"
import { keyframes } from "@emotion/core"
import Box from "../Box/Box"

const ellipsis1 = keyframes(`
 0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`)

const ellipsis2 = (gapSize: number): string =>
  keyframes(`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(${gapSize * 3}px, 0);
  }
`)

const ellipsis3 = keyframes(`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`)

interface Props {
  size: number
}
export const LoadingIndicator: FC<Props> = ({ size = 80 }) => {
  const ballSize = Math.round(size / 6)
  const gapSize = Math.round(size / 10)

  return (
    <Box
      sx={{
        display: "inline-block",
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        "& div": {
          position: "absolute",
          top: Math.round((size - ballSize) * 0.5),
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          borderRadius: "50%",
          background: "black",
          animationTimingFunction: "cubic-bezier(0, 1, 1, 0)",
          "&:nth-child(1)": {
            left: `${gapSize}px`,
            animation: `${ellipsis1} 0.6s infinite`,
          },
          "&:nth-child(2)": {
            left: `${gapSize}px`,
            animation: `${ellipsis2(gapSize)} 0.6s infinite`,
          },
          "&:nth-child(3)": {
            left: `${gapSize * 4}px`,
            animation: `${ellipsis2(gapSize)} 0.6s infinite`,
          },
          "&:nth-child(4)": {
            left: `${gapSize * 7}px`,
            animation: `${ellipsis3} 0.6s infinite`,
          },
        },
      }}
    >
      <div />
      <div />
      <div />
      <div />
    </Box>
  )
}

export default LoadingIndicator
