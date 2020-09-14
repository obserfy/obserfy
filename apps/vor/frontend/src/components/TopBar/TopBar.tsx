import React, { FC } from "react"
import { Flex } from "theme-ui"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"

export interface TopBarProps {
  breadcrumbs: Array<{
    to?: string
    text?: string
  }>
}
export const TopBar: FC<TopBarProps> = ({ breadcrumbs }) => (
  <Flex sx={{ height: 48, alignItems: "center" }}>
    <BackButton
      to={breadcrumbs[Math.max(breadcrumbs.length - 2, 0)].to ?? "/"}
    />
    <Breadcrumb>
      {breadcrumbs.map(({ to, text }) => (
        <BreadcrumbItem to={to}>{text}</BreadcrumbItem>
      ))}
    </Breadcrumb>
  </Flex>
)

export default TopBar
