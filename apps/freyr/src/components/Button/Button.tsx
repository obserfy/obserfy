import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"
import * as styles from "./Button.module.css"

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  secondary?: boolean
}

const Button: FC<Props> = ({
  secondary,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
      ${className || ""} 
      ${secondary ? styles.secondary : ""}
      ${styles.base}
      `}
      {...props}
    />
  )
}

export default Button
