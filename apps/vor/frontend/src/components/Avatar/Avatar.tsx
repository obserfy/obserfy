import React, { FC, PropsWithoutRef } from "react"
import { Image, ImageProps } from "theme-ui"

interface Props extends PropsWithoutRef<ImageProps> {
  source?: string
}
export const Avatar: FC<Props> = (props) => {
  return (
    <Image
      sx={{
        width: 32,
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
