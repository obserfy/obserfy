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
    {label && (
      <Box pl={1} pb={1}>
        {label}
      </Box>
    )}
    <BaseTextArea {...props} />
  </Label>
)

export default TextArea
