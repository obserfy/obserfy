import { FC } from "react"
import style from "./LoadingPlaceholder.module.css"

const LoadingPlaceholder: FC<{ className?: string }> = ({ className }) => {
  return <div className={`${className} animate-pulse ${style.base}`} />
}

export default LoadingPlaceholder
