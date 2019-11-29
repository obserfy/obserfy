import React, { FC } from "react"
import { Box as BaseBox, BoxProps as BaseBoxProps } from "rebass"

export type BoxProps = Omit<BaseBoxProps, "css">
export const Box: FC<BoxProps> = props => <BaseBox {...props} />

export default Box
