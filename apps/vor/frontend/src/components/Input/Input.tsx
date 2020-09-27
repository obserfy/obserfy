import React, {
  ChangeEventHandler,
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithoutRef,
} from "react"
import {
  Box,
  Flex,
  Input as BaseInput,
  InputProps,
  Label,
  SxStyleProp,
} from "theme-ui"
import Icon from "../Icon/Icon"

interface Props extends PropsWithoutRef<InputProps> {
  name?: string
  icon?: FC
  small?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  onEnterPressed?: () => void
  label?: string
  containerSx?: SxStyleProp
}
const Input: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  {
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
    containerSx,
    ...props
  },
  ref
) => {
  let modifiedSx = sx
  if (icon !== undefined) {
    modifiedSx = { ...modifiedSx, pl: small ? 34 : 52 }
  }
  return (
    <Label
      color="textMediumEmphasis"
      sx={{
        display: "flex",
        flexDirection: "column",
        fontSize: small ? 0 : undefined,
        ...containerSx,
      }}
    >
      {label && <Box pb={1}>{label}</Box>}
      <Flex sx={{ alignItems: "center" }}>
        {icon && (
          <Icon
            as={icon}
            mr={small ? -28 : -36}
            sx={{ width: 24, height: 24, zIndex: 2 }}
            ml={small ? 2 : 3}
          />
        )}
        <BaseInput
          ref={ref}
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
            ...modifiedSx,
            fontSize: small ? 1 : undefined,
          }}
          {...props}
        />
      </Flex>
    </Label>
  )
}

export default forwardRef(Input)
