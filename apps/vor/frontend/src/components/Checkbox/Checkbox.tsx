import React, { FC } from "react"
import { Checkbox as BaseCheckbox, Label } from "theme-ui"
import { Trans } from "@lingui/macro"

export interface CheckboxProps {
  label: string
  onChange?: (value: boolean) => void
  value?: boolean
}
const Checkbox: FC<CheckboxProps> = ({ onChange, value, label }) => (
  <Label mb={3} sx={{ display: "flex", alignItems: "center" }}>
    <BaseCheckbox
      onChange={(e) => {
        onChange?.(e.target.checked)
      }}
      checked={value}
    />
    <Trans id={label} />
  </Label>
)

export default Checkbox
