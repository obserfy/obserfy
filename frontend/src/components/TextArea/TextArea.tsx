import React, { ChangeEventHandler, FC } from "react"
import { Textarea as BaseTextArea } from "@rebass/forms"
import Label from "../Label/Label"
import Box, { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
  label?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const TextArea: FC<Props> = ({ label, ...props }) => (
  <Label display="flex" sx={{ flexDirection: "column" }}>
    {label && <Box pb={1}>{label}</Box>}
    <BaseTextArea aria-label={label} {...props} />
  </Label>
)

export default TextArea
