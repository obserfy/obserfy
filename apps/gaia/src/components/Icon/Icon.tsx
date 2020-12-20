import React, { FC } from "react"
import Image from "next/image"

interface Props {
  src: string
  className?: string
  alt?: string
  size?: number
}
const Icon: FC<Props> = ({ alt, src, className, size = 14 }) => (
  <Image alt={alt} src={src} width={size} height={size} className={className} />
)

export default Icon
