import React, { ChangeEventHandler, FC } from "react"
import { Select as BaseSelect } from "@rebass/forms"
import Label from "../Label/Label"
import Box, { BoxProps } from "../Box/Box"

export interface SelectProps extends BoxProps {
  label?: string
  hideLabel?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const Select: FC<SelectProps> = ({
  children,
  hideLabel,
  label,
  defaultValue,
  value,
  onChange,
  ...props
}) => (
  <Label display="flex" sx={{ flexDirection: "column" }} {...props}>
    {label && !hideLabel && <Box pb={1}>{label}</Box>}
    <BaseSelect
      onChange={onChange}
      defaultValue={defaultValue}
      value={value}
      aria-label={label}
    >
      {children}
    </BaseSelect>
  </Label>
)

export default Select
