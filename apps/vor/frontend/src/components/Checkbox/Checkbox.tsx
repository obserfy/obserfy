import React, { FC } from "react"
import { SxStyleProp, Checkbox as BaseCheckbox, Label } from "theme-ui"
import { Trans } from "@lingui/macro"

export interface CheckboxProps {
  label: string
  onChange?: (value: boolean) => void
  value?: boolean
  containerSx?: SxStyleProp
  defaultChecked?: boolean
}
const Checkbox: FC<CheckboxProps> = ({
  defaultChecked,
  containerSx,
  onChange,
  value,
  label,
}) => (
  <Label sx={{ display: "flex", alignItems: "center", ...containerSx }}>
    <BaseCheckbox
      defaultChecked={defaultChecked}
      onChange={(e) => onChange?.(e.target.checked)}
      checked={value}
    />
    <Trans id={label} />
  </Label>
)

export default Checkbox
