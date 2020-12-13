import React, { FC } from "react"
import { Box, BoxProps } from "theme-ui"
import { Trans } from "@lingui/macro"
import { borderFull } from "../../border"
import Typography from "../Typography/Typography"

interface Props extends Omit<BoxProps, "css"> {
  text?: string
}
export const Pill: FC<Props> = ({ sx, color, text, ...props }) => (
  <Box
    py={1}
    px={2}
    sx={{
      ...borderFull,
      borderRadius: "circle",
      flexShrink: 0,
      display: "inline-block",
      ...sx,
    }}
    {...props}
  >
    <Typography.Body
      color={color}
      sx={{
        fontSize: [0, 0],
        lineHeight: "1em",
        textTransform: "capitalize",
      }}
    >
      <Trans id={text} />
    </Typography.Body>
  </Box>
)

export default Pill
