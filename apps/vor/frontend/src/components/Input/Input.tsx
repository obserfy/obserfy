import React, { ChangeEventHandler, FC, PropsWithoutRef } from "react"
import { Input as BaseInput, InputProps, Label, Flex, Box } from "theme-ui"
import Icon from "../Icon/Icon"

interface Props extends PropsWithoutRef<InputProps> {
  name?: string
  icon?: FC
  small?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  onEnterPressed?: () => void
  label?: string
}
export const Input: FC<Props> = ({
  autoFocus,
  name,
  small,
  sx,
  type,
  icon,
  disabled,
  onEnterPressed,
  backgroundColor,
  placeholder,
  width,
  onChange,
  value,
  label,
  ...props
}) => {
  let withIconStyle = sx
  if (icon !== undefined) {
    withIconStyle = Object.assign(withIconStyle || {}, {
      backgroundSize: 24,
      backgroundPosition: "center",
      backgroundPositionX: 16,
      pl: 52,
    })
  }
  return (
    <Label
      color={disabled ? "textDisabled" : "textMediumEmphasis"}
      sx={{
        display: "flex",
        flexDirection: "column",
        fontSize: small ? 0 : undefined,
      }}
    >
      {label && <Box pb={small ? 2 : 1}>{label}</Box>}
      <Flex sx={{ alignItems: "center" }}>
        {icon && (
          <Icon
            as={icon}
            m={0}
            mr={-40}
            sx={{ width: 24, height: 24, zIndex: 2 }}
            ml={3}
          />
        )}
        <BaseInput
          autoFocus={autoFocus}
          name={name}
          onKeyUp={(e) => {
            if (onEnterPressed && e.keyCode === 13) onEnterPressed()
          }}
          type={type}
          disabled={disabled}
          py={small ? 2 : undefined}
          backgroundColor={backgroundColor}
          placeholder={placeholder}
          width={width}
          onChange={onChange}
          value={value}
          sx={{
            ...withIconStyle,
            fontSize: small ? 1 : undefined,
          }}
          {...props}
        />
      </Flex>
    </Label>
  )
}

export default Input
