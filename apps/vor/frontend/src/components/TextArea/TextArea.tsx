import React, {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithoutRef,
} from "react"
import {
  Box,
  Label,
  SxStyleProp,
  Textarea as BaseTextArea,
  TextareaProps,
} from "theme-ui"
import { Trans } from "@lingui/macro"

interface Props extends PropsWithoutRef<TextareaProps> {
  label?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  containerSx?: SxStyleProp
}
export const TextArea: ForwardRefRenderFunction<HTMLTextAreaElement, Props> = (
  { label, containerSx, ...props },
  ref
) => (
  <Label sx={{ display: "flex", flexDirection: "column", ...containerSx }}>
    {label && (
      <Box pb={1}>
        <Trans id={label} />
      </Box>
    )}
    <BaseTextArea ref={ref} aria-label={label} {...props} />
  </Label>
)

export default forwardRef(TextArea)
