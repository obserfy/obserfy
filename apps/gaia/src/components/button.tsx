import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"

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
        ${outline && "bg-white"}
        ${outline && "border"}
        ${className}
      `}
      style={{ touchAction: "manipulation" }}
    />
  )
}

export default Button
