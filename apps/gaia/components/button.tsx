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
        py-1 
        px-6 
        rounded 
        text-onPrimary 
        ${outline ? "bg-white" : "bg-primary"}
        ${outline && "border"}
        ${className}
      `}
    />
  )
}

export default Button
