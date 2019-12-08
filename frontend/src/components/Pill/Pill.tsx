import React, { FC } from "react"
import Box, { BoxProps } from "../Box/Box"
import Typography from "../Typography/Typography"

interface Props extends BoxProps {
  text: string
}
export const Pill: FC<Props> = ({ text, ...props }) => (
  <Box py={1} px={2} sx={{ borderRadius: "circle" }} {...props}>
    <Typography.Body lineHeight="1em" fontSize={0}>
      {text}
    </Typography.Body>
  </Box>
)

export default Pill
