import React, { FC } from "react"

import { Label as BaseLabel } from "@rebass/forms"
import { TextProps } from "rebass"

export const Label: FC<Omit<TextProps, "css">> = ({ children, ...props }) => (
  <BaseLabel {...props}>{children}</BaseLabel>
)

export default Label
