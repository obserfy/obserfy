import React, { FC, PropsWithoutRef } from "react"
import { Image, ImageProps } from "theme-ui"

interface Props extends PropsWithoutRef<ImageProps> {
  fill?: string
  size?: string | number
}
export const Icon: FC<Props> = ({ size = "icon", fill, sx, ...props }) => (
  <Image
    m={3}
    height="icon"
    width="icon"
    sx={{
      ...sx,
      fill: fill || "icon",
      flexShrink: 0,
      width: size,
      height: size,
    }}
    {...props}
  />
)

export default Icon
