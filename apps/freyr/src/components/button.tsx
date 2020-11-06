import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"

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
      ${className} 
      ${
        secondary &&
        "border text-green-900 border-green-900 border-solid bg-transparent"
      }
      `}
      {...props}
    />
  )
}

export default Button
