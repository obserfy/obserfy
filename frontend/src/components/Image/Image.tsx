import React, { FC } from "react"
import { Image as BaseImage, ImageProps as BaseImageProps } from "rebass"

export type ImageProps = Omit<BaseImageProps, "css">
export const Image: FC<ImageProps> = props => <BaseImage {...props} />

export default Image
