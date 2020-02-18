import React, { ChangeEventHandler, FC } from "react"
import { Input as BaseInput } from "@rebass/forms"
import Label from "../Label/Label"
import Box, { BoxProps } from "../Box/Box"
import Icon from "../Icon/Icon"
import { Flex } from "../Flex/Flex"

interface Props extends BoxProps {
  name?: string
  icon?: FC
  small?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  onEnterPressed?: () => void
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
      display="flex"
      color={disabled ? "textDisabled" : "textMediumEmphasis"}
      sx={{ flexDirection: "column" }}
      fontSize={small ? 0 : undefined}
      {...props}
    >
      {label && <Box pb={small ? 2 : 1}>{label}</Box>}
      <Flex alignItems="center">
        {icon && (
          <Icon as={icon} m={0} mr={-40} size={24} sx={{ zIndex: 2 }} ml={3} />
        )}
        <BaseInput
          autoFocus={autoFocus}
          name={name}
          onKeyUp={e => {
            if (onEnterPressed && e.keyCode === 13) onEnterPressed()
          }}
          type={type}
          disabled={disabled}
          py={small ? 2 : undefined}
          sx={withIconStyle}
          fontSize={small ? 1 : undefined}
          backgroundColor={backgroundColor}
          placeholder={placeholder}
          width={width}
          onChange={onChange}
          value={value}
        />
      </Flex>
    </Label>
  )
}

export default Input
