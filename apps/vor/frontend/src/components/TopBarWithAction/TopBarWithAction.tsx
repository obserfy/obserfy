import { Trans } from "@lingui/macro"
import React, { FC, ReactNode } from "react"
import { Button, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import TopBar, { BreadcrumbData } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface TopBarWithActionProps {
  breadcrumbs: BreadcrumbData[]
  disableAction?: boolean
  onActionClick: () => void
  buttonContent?: ReactNode
}
const TopBarWithAction: FC<TopBarWithActionProps> = ({
  disableAction,
  breadcrumbs,
  onActionClick,
  buttonContent,
  children,
}) => (
  <TranslucentBar boxSx={{ position: "sticky", top: 0, ...borderBottom }}>
    <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} mx="auto">
      <TopBar breadcrumbs={breadcrumbs} />
      <Button
        data-cy="finish-cta"
        ml="auto"
        mr={3}
        px={2}
        onClick={onActionClick}
        disabled={disableAction}
      >
        {buttonContent || <Trans>Add</Trans>}
      </Button>
    </Flex>

    {children}
  </TranslucentBar>
)

export default TopBarWithAction
