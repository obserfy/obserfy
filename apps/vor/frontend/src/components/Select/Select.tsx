import { ChangeEventHandler, FC, PropsWithoutRef } from "react"
import {
  Box,
  Label,
  Select as BaseSelect,
  SelectProps as BaseSelectProps,
  SxProp,
} from "theme-ui"
import { Trans } from "@lingui/macro"

export interface SelectProps extends PropsWithoutRef<BaseSelectProps>, SxProp {
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
    {label && !hideLabel && (
      <Box pb={1}>
        <Trans id={label} />
      </Box>
    )}
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
