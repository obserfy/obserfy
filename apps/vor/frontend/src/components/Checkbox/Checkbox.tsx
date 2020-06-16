import React, { ChangeEventHandler, FC, PropsWithoutRef } from "react"
import { Checkbox as BaseCheckbox, CheckboxProps, Label } from "theme-ui"

interface Props extends PropsWithoutRef<CheckboxProps> {
  id?: string
  label?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const Checkbox: FC<Props> = ({
  value,
  onChange,
  label,
  checked,
  sx,
  ...props
}) => {
  return (
    <Label
      sx={{
        display: "flex",
        fontSize: 2,
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <BaseCheckbox
        checked={checked}
        onChange={onChange}
        value={value}
        {...props}
      />
      {label}
    </Label>
  )
}

export default Checkbox
