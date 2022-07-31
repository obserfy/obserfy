import { FC } from "react"

const Icon: FC<{
  src: string
  className?: string
  color?: string
}> = ({ src, className, color = "bg-black" }) => (
  <div
    role="img"
    aria-hidden="true"
    className={`h-5 w-5 ${color} ${className}`}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,

      maskSize: "100%",
      WebkitMaskSize: "100%",

      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
    }}
  />
)

export default Icon
