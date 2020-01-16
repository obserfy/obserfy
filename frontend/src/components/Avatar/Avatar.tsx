import React, { FC } from "react"
import { FixedObject } from "gatsby-image"
import { BoxProps } from "../Box/Box"
import { Image } from "../Image/Image"

interface Props extends BoxProps {
  source?: string
  fixed?: FixedObject
}
export const Avatar: FC<Props> = props => {
  return (
    <Image
      size={32}
      sx={{
        objectFit: "cover",
        objectPosition: "center",
        borderRadius: "circle",
        borderColor: "border",
        borderWidth: "1px",
        borderStyle: "solid",
        overflow: "hidden",
      }}
      {...props}
    />
  )
}

export default Avatar
