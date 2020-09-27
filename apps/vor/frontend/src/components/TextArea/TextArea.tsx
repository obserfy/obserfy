import React, { ChangeEvent, FC, PropsWithoutRef } from "react"
import { Box, Label, Textarea as BaseTextArea, TextareaProps } from "theme-ui"
import { Trans } from "@lingui/macro"

interface Props extends PropsWithoutRef<TextareaProps> {
  label?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
}
export const TextArea: FC<Props> = ({ label, ...props }) => (
  <Label sx={{ display: "flex", flexDirection: "column" }}>
    {label && (
      <Box pb={1}>
        <Trans id={label} />
      </Box>
    )}
    <BaseTextArea aria-label={label} {...props} />
  </Label>
)

export default TextArea
