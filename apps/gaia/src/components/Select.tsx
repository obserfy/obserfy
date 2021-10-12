import { ChangeEventHandler, FC } from "react"

const Select: FC<{
  value?: string
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
  label: string
  name: string
  containerClassName?: string
}> = ({
  value,
  defaultValue,
  onChange,
  children,
  label,
  name,
  containerClassName,
}) => (
  <label htmlFor="areas" className={containerClassName}>
    <span className="block text-sm font-medium text-gray-700">{label}</span>
    <select
      id={name}
      name={name}
      className="block py-2 pr-10 pl-3 mt-1 w-full text-base sm:text-sm rounded-md border-gray-200 focus:border-primary-500 focus:ring-primary-500 shadow-sm focus:outline-none"
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  </label>
)

export default Select
