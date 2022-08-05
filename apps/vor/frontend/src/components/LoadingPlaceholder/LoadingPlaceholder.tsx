import { keyframes } from "@emotion/react"
import { FC } from "react"
import { Box, BoxProps } from "theme-ui"

const fading = keyframes`
  0% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.05;
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
      animation: `4s infinite ${fading}`,
      backgroundColor: "#a5a5a5",
      ...sx,
    }}
    {...props}
  />
)

export default LoadingPlaceholder
