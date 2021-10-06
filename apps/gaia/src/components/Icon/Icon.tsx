import { FC } from "react"

const Icon: FC<{
  src: string
  className?: string
  color?: string
}> = ({ src, className, color = "bg-black" }) => (
  <div
    role="img"
    aria-hidden="true"
    className={`w-5 h-5 ${color} ${className}`}
    style={{
      maskImage: `url(${src})`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      "-webkit-mask-image": `url(${src})`,

      maskSize: "100%",
      "-webkit-mask-size": "100%",

      maskRepeat: "no-repeat",
      "-webkit-mask-repeat": "no-repeat",
    }}
  />
)

export default Icon
