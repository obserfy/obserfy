import React, { FC } from "react"
import { BoxProps, Card as BaseCard } from "rebass"

export interface CardProps extends Omit<BoxProps, "css"> {
  borderRadius?: string | number | Array<string | number>
}
export const Card: FC<CardProps> = ({
  sx,
  borderRadius,
  maxWidth = "",
  ...props
}) => {
  let sxStyle = sx
  if (borderRadius !== undefined) {
    sxStyle = Object.assign(sxStyle || {}, {
      borderRadius,
    })
  }
  return (
    <BaseCard
      p={0}
      backgroundColor="surface"
      maxWidth={maxWidth}
      overflow="hidden"
      sx={sxStyle}
      {...props}
    />
  )
}

export default Card
