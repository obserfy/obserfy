import React, { FC } from "react"
import { Button as ButtonBase, ButtonProps as BaseButtonProps } from "rebass"
import { Icon } from "../Icon/Icon"

// Button styles are mostly handled by theme
export interface ButtonProps extends Omit<BaseButtonProps, "css"> {
  onClick?: () => void
  onMouseEnter?: () => void
  icon?: FC
}
export const Button: FC<ButtonProps> = ({
  onMouseEnter,
  onClick,
  children,
  icon,
  sx,
  ...props
}) => (
  <ButtonBase
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    display="flex"
    sx={{ ...sx, alignItems: "center", justifyContent: "center" }}
    {...props}
  >
    {icon && <Icon as={icon} m={0} mr={2} />}
    {children}
  </ButtonBase>
)

export default Button
