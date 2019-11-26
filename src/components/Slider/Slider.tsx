import React, { FC } from "react"
import { Slider as BaseSlider } from "@rebass/forms"
import { BoxProps } from "../Box/Box"

export const Slider: FC<BoxProps> = props => <BaseSlider {...props} />

export default Slider
