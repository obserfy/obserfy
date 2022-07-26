import clsx from "clsx"
import { ChangeEventHandler, FC } from "react"
import Icon from "$components/Icon/Icon"

const TextFieldWithIcon: FC<{
  label: string
  name: string
  value: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  containerClassName?: string
  hideLabel?: boolean
  inputClassName?: string
}> = ({
  value,
  name,
  label,
  onChange,
  containerClassName,
  hideLabel,
  inputClassName,
  placeholder = "",
}) => (
  <label htmlFor={name} className={`block ${containerClassName}`}>
    <span
      className={clsx(
        "block text-sm font-medium text-gray-700",
        hideLabel && "sr-only"
      )}
    >
      {label}
    </span>

    <div
      className={clsx(
        "relative rounded-md shadow-sm",
        inputClassName,
        hideLabel || "mt-1 "
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon
          src="/icons/search.svg"
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="text"
        name={name}
        id={name}
        className={clsx(
          "block w-full rounded-md border-gray-200 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
          inputClassName
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </label>
)

export default TextFieldWithIcon
