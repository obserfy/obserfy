import { ChangeEventHandler, FC } from "react"
import Icon from "$components/Icon/Icon"

const TextFieldWithIcon: FC<{
  label: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  containerClassName?: string
}> = ({
  value,
  name,
  label,
  onChange,
  placeholder = "",
  containerClassName,
}) => (
  <label htmlFor={name} className={`block ${containerClassName}`}>
    <span className="block text-sm font-medium text-gray-700">{label}</span>
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <Icon
          src="/icons/search.svg"
          className="w-5 h-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="text"
        name={name}
        id={name}
        className="block pl-10 w-full sm:text-sm rounded-md border-gray-200 focus:border-primary-500 focus:ring-primary-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </label>
)

export default TextFieldWithIcon
