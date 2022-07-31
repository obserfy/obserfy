import clsx from "clsx"
import { ChangeEventHandler, FC } from "react"

const Select: FC<{
  value?: string
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
  label: string
  name: string
  hideLabel?: boolean
  containerClassName?: string
  selectClassName?: string
}> = ({
  value,
  defaultValue,
  onChange,
  children,
  label,
  name,
  containerClassName,
  selectClassName,
  hideLabel,
}) => (
  <label htmlFor="areas" className={clsx(containerClassName, "block")}>
    <span
      className={clsx(
        "block text-sm font-medium text-gray-700",
        hideLabel && "sr-only"
      )}
    >
      {label}
    </span>
    <select
      id={name}
      name={name}
      className={clsx(
        selectClassName,
        "mt-1 block w-full rounded-md border-gray-200 py-2 pr-10 pl-3 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
      )}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  </label>
)

export default Select
