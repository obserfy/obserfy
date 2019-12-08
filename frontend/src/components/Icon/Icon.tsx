import React, { FC } from "react"
import { Image, ImageProps } from "../Image/Image"

interface Props extends ImageProps {
  fill?: string
}
export const Icon: FC<Props> = ({ fill, sx, ...props }) => {
  let customSx = sx
  customSx = Object.assign(customSx || {}, {
    fill: fill || "icon",
  })
  return <Image m={3} height="icon" width="icon" sx={customSx} {...props} />
}

export default Icon
