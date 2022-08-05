import { FC } from "react"
import { Flex, ThemeUIStyleObject } from "theme-ui"
import { Trans } from "@lingui/macro"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"

export interface BreadcrumbData {
  to?: string
  text: string
}
export interface TopBarProps {
  breadcrumbs: BreadcrumbData[]
  containerSx?: ThemeUIStyleObject
}
export const TopBar: FC<TopBarProps> = ({ breadcrumbs, containerSx }) => (
  <Flex sx={{ height: 48, alignItems: "center", ...containerSx }}>
    <BackButton
      to={breadcrumbs[Math.max(breadcrumbs.length - 2, 0)].to ?? "/"}
      state={{ preserveScroll: true }}
    />
    <Breadcrumb>
      {breadcrumbs.map(({ to, text }) => (
        <BreadcrumbItem key={text + (to ?? "empty")} to={to}>
          <Trans id={text} />
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  </Flex>
)

export const breadCrumb = (text?: string, to?: string): BreadcrumbData => ({
  text: text ?? "",
  to,
})

export default TopBar
