import React, { FC } from "react"
import { SxStyleProp, Checkbox as BaseCheckbox, Label } from "theme-ui"
import { Trans } from "@lingui/macro"

export interface CheckboxProps {
  label: string
  onChange?: (value: boolean) => void
  checked?: boolean
  containerSx?: SxStyleProp
  defaultChecked?: boolean
  disabled?: boolean
}
const Checkbox: FC<CheckboxProps> = ({
  defaultChecked,
  containerSx,
  onChange,
  checked,
  label,
  disabled,
}) => (
  <Label sx={{ display: "flex", alignItems: "center", ...containerSx }}>
    <BaseCheckbox
      defaultChecked={defaultChecked}
      onChange={(e) => onChange?.(e.target.checked)}
      checked={checked}
      disabled={disabled}
    />
    <Trans id={label} />
  </Label>
)

export default Checkbox
