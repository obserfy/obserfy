import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"
import styles from "./Button.module.css"

interface Props {
  outline?: boolean
}

const Button: FC<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    Props
> = ({ outline, className, ...props }) => {
  return (
    <button
      {...props}
      className={`
        ${styles.base} 
        ${outline && styles.outline} 
        ${className} 
      `}
    />
  )
}

export default Button
