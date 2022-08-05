import { FC } from "react"
import { Flex, ThemeUIStyleObject } from "theme-ui"

export interface BreadcrumbProps {
  sx?: ThemeUIStyleObject
}
export const Breadcrumb: FC<BreadcrumbProps> = ({ sx, children }) => (
  <Flex sx={{ ...sx, alignItems: "center", overflowX: "auto" }}>
    {children}
  </Flex>
)

export default Breadcrumb
