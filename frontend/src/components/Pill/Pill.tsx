import React, { FC } from "react"
import Box, { BoxProps } from "../Box/Box"
import Typography from "../Typography/Typography"

interface Props extends BoxProps {
  text: string
}
export const Pill: FC<Props> = ({ color, text, ...props }) => {
  const borderProps = {
    borderColor: "border",
    borderWidth: 1,
    borderStyle: "solid",
  }
  return (
    <Box
      py={1}
      px={2}
      sx={{ ...borderProps, borderRadius: "circle", flexShrink: 0 }}
      {...props}
    >
      <Typography.Body
        lineHeight="1em"
        fontSize={0}
        color={color}
        sx={{ textTransform: "capitalize" }}
      >
        {text}
      </Typography.Body>
    </Box>
  )
}

export default Pill
