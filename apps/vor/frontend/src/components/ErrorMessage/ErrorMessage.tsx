import React, { FC } from "react"
import { TextProps } from "theme-ui"
import { Typography } from "../Typography/Typography"

interface Props extends TextProps {
  error: unknown
}
export const ErrorMessage: FC<Props> = ({ error, ...props }) => (
  <Typography.Body {...props} sx={{ textAlign: "center" }} color="error">
    {error instanceof Error && error.message}
  </Typography.Body>
)

export default ErrorMessage
