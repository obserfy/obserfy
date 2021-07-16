import Image from "next/image"
import { FC } from "react"

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
