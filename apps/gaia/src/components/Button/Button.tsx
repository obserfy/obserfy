import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"
import styles from "./Button.module.css"

interface Props {
  outline?: boolean
  small?: boolean
  iconOnly?: boolean
}

const Button: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    Props
> = ({ iconOnly, small, outline, className, ...props }) => {
  return (
    <button
      {...props}
      className={`
        ${styles.base} 
        ${outline && styles.outline} 
        ${small && styles.small}
        ${iconOnly && styles.icon}
        ${className} 
      `}
    />
  )
}

export default Button
