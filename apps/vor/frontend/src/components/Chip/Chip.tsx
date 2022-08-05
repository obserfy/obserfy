import { FC } from "react"
import { BoxProps, Box } from "theme-ui"
import { Trans } from "@lingui/macro"
import Typography from "../Typography/Typography"

interface Props extends Omit<BoxProps, "css"> {
  text: string
  activeBackground?: string
  isActive?: boolean
  backgroundColor?: string
}
export const Chip: FC<Props> = ({
  isActive,
  activeBackground = "primary",
  text,
  sx,
  backgroundColor = "surface",
  ...props
}) => (
  <Box
    {...props}
    backgroundColor={isActive ? activeBackground : backgroundColor}
    px={2}
    py={1}
    sx={{
      ...sx,
      display: "inline-block",
      userSelect: "none",
      cursor: "pointer",
      borderRadius: "default",
      borderColor: "border",
      borderWidth: 1,
      borderStyle: "solid",
      whiteSpace: "nowrap",
      "&:hover": {
        backgroundColor: isActive ? activeBackground : "primaryLightest",
      },
    }}
  >
    <Typography.Body
      sx={{ fontSize: 1 }}
      color={isActive ? "onPrimary" : "text"}
    >
      <Trans id={text} />
    </Typography.Body>
  </Box>
)

export default Chip
