import React, { FC } from "react"
import { keyframes } from "@emotion/react"
import { BoxProps, Box } from "theme-ui"

const fading = keyframes`
  0% {
    background-color: 
    rgba(165, 165, 165, 0.05);
  }
  50% {
    background-color: 
    rgba(165, 165, 165, 0.2);
  }
  100% {
    background-color: 
    rgba(165, 165, 165, 0.05);
  }
`
interface Props extends Omit<BoxProps, "css"> {
  variant?: "loadingPlaceholder.text"
  m?: number
}
export const LoadingPlaceholder: FC<Props> = ({ sx, ...props }) => (
  <Box
    sx={{
      borderRadius: "default",
      animation: `1s ease-in-out 0s infinite ${fading}`,
      ...sx,
    }}
    {...props}
  />
)

export default LoadingPlaceholder
