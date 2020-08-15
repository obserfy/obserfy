import React, { FC } from "react"
import styles from "./Textarea.module.css"

interface Props {
  className?: string
  label: string
  placeholder?: string
}
const Textarea: FC<Props> = ({ placeholder, label, className }) => {
  return (
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
      />
    </div>
  )
}

export default Textarea
