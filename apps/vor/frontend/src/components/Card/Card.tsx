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
  return (
    <BaseCard
      p={0}
      maxWidth={maxWidth}
      overflow="hidden"
      sx={{
        ...sx,
        borderRadius,
      }}
      {...props}
    />
  )
}

export default Card
