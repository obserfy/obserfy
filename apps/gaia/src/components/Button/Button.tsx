import clsx from "clsx"
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react"

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "outline" | "icon"
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    const base =
      "inline-flex items-center px-4 py-2 border justify-center flex-shrink-0 disabled:opacity-30 transition-opacity"
    const primary =
      "border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    const secondary =
      "border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    const outline =
      "border border-gray-200 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"

    const icon =
      "hover:text-gray-500 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none !p-1 border-none"

    return (
      <button
        {...props}
        type={type}
        ref={ref}
        className={clsx(
          base,
          className,
          variant === "primary" && primary,
          variant === "secondary" && secondary,
          variant === "outline" && outline,
          variant === "icon" && icon
        )}
      />
    )
  }
)

export default Button
