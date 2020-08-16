import React, { ChangeEventHandler, FC } from "react"
import styles from "./Textarea.module.css"

interface Props {
  className?: string
  label: string
  placeholder?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
}
const Textarea: FC<Props> = ({
  value,
  onChange,
  placeholder,
  label,
  className,
}) => (
  <div
    className={`${styles.container} ${className} focus-within:shadow-outline`}
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
    />
  </div>
)

export default Textarea
