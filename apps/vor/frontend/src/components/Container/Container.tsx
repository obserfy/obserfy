import React, { FC } from "react"
import { Box, BoxProps } from "theme-ui"

/**
 * Provide a maximum width and automatically center itself inside its parent.
 */
export const Container: FC<Omit<BoxProps, "css">> = (props) => (
  <Box
    sx={{
      maxWidth: 1024,
      mx: "auto",
    }}
    {...props}
  />
)

export default Container
