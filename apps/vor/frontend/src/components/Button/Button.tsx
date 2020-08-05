import React, { FC } from "react"
import { Button as ButtonBase, ButtonProps as BaseButtonProps } from "theme-ui"
import { Icon } from "../Icon/Icon"

// Button styles are mostly handled by theme

export interface ButtonProps extends Omit<BaseButtonProps, "css"> {
  onClick?: () => void
  onMouseEnter?: () => void
  icon?: FC
}
/**
 * @deprecated use theme-ui Button component directly
 * */
export const Button: FC<ButtonProps> = ({
  onMouseEnter,
  onClick,
  children,
  icon,
  ...props
}) => (
  <ButtonBase onClick={onClick} onMouseEnter={onMouseEnter} {...props}>
    {icon && <Icon as={icon} mr={2} />}
    {children}
  </ButtonBase>
)

export default Button
