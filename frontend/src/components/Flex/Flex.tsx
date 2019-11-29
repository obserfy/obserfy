import React, { FC, forwardRef } from "react"
import { Flex as BaseFlex, FlexProps as BaseFlexProps } from "rebass"

export type FlexProps = Omit<BaseFlexProps, "css">
export const Flex: FC<FlexProps> = forwardRef<FlexProps>((props, ref) => (
  <BaseFlex ref={ref} {...props} />
))

export default Flex
