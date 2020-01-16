import React, { ChangeEventHandler, FC } from "react"
import { Checkbox as BaseCheckbox } from "@rebass/forms"
import Label from "../Label/Label"
import { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
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
  let withSx = sx
  withSx = Object.assign(withSx || {}, {
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  })
  return (
    <Label display="flex" sx={withSx} fontSize={2} {...props}>
      <BaseCheckbox checked={checked} onChange={onChange} value={value} />
      {label}
    </Label>
  )
}

export default Checkbox
