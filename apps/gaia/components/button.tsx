import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"

const Button: FC<DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = ({ className, ...props }) => {
  return (
    <button
      {...props}
      className={`py-1 px-6 bg-primary rounded text-onPrimary ${className}`}
    />
  )
}

export default Button
