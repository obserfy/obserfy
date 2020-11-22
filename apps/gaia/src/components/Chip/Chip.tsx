import React, { FC } from "react"
import style from "./Chip.module.css"

interface Props {
  containerStyle?: String
  isActive?: boolean
  onClick?: () => void
}
const Chip: FC<Props> = ({ isActive, containerStyle, children, onClick }) => {
  const container = `
    ${style.container}
    ${isActive ? style.active : ""}
    ${containerStyle ?? ""}
  `
  return (
    <button className={container} onClick={onClick}>
      {children}
    </button>
  )
}

export default Chip
