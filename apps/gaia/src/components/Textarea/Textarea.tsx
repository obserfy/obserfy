import React, { ChangeEventHandler, FC } from "react"
import styles from "./Textarea.module.css"

interface Props {
  className?: string
  label: string
  placeholder?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  disabled?: boolean
}
const Textarea: FC<Props> = ({
  value,
  onChange,
  placeholder,
  label,
  className,
  disabled,
}) => (
  <div
    className={`${styles.container} ${className} focus-within:shadow-outline ${
      disabled && "opacity-50"
    }`}
  >
    <label htmlFor={label} className={styles.label}>
      {label}
    </label>
    <textarea
      id={label}
      className={styles.textarea}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
)

export default Textarea
