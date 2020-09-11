import React, { FC } from "react"
import { Flex, SxStyleProp } from "theme-ui"

export interface BreadcrumbProps {
  sx?: SxStyleProp
}
export const Breadcrumb: FC<BreadcrumbProps> = ({ sx, children }) => (
  <Flex
    sx={{ ...sx, alignItems: "center", overflowX: "auto", overflowY: "hidden" }}
  >
    {children}
  </Flex>
)

export default Breadcrumb
