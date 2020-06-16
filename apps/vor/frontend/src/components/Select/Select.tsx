import React, { ChangeEventHandler, FC, PropsWithoutRef } from "react"
import {
  Box,
  Label,
  Select as BaseSelect,
  SelectProps as BaseSelectProps,
  SxProps,
} from "theme-ui"

export interface SelectProps extends PropsWithoutRef<BaseSelectProps>, SxProps {
  label?: string
  hideLabel?: boolean
  onChange?: ChangeEventHandler<HTMLSelectElement>
}
export const Select: FC<SelectProps> = ({
  children,
  hideLabel,
  label,
  defaultValue,
  value,
  onChange,
  sx,
  ...props
}) => (
  <Label sx={{ ...sx, display: "flex", flexDirection: "column" }}>
    {label && !hideLabel && <Box pb={1}>{label}</Box>}
    <BaseSelect
      onChange={onChange}
      defaultValue={defaultValue}
      value={value}
      aria-label={label}
      {...props}
    >
      {children}
    </BaseSelect>
  </Label>
)

export default Select
