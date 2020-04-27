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
      ${className} py-3  px-8
      font-body
      font-bold
      shadow-sm
      ${
        secondary
          ? "bg-green-100 text-green-900 border-green-900 border-solid"
          : "bg-green-500 text-white"
      }  rounded`}
      {...props}
    />
  )
}

export default Button
