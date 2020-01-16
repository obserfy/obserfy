import React, { FC } from "react"
import { Box, BoxProps } from "../Box/Box"

/**
 * Provide a maximum width and automatically center itself inside its parent.
 */
export const Container: FC<BoxProps> = props => (
  <Box
    sx={{
      maxWidth: 1024,
      mx: "auto",
    }}
    {...props}
  />
)

export default Container
