import { t, Trans } from "@lingui/macro"
import { FC } from "react"
import { Button, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import TopBar, { BreadcrumbData } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface TopBarWithActionProps {
  breadcrumbs: BreadcrumbData[]
  disableAction?: boolean
  onActionClick: () => void
  actionText?: string
  isLoading?: boolean
}

const TopBarWithAction: FC<TopBarWithActionProps> = ({
  disableAction,
  breadcrumbs,
  onActionClick,
  actionText = t`Add`,
  children,
  isLoading,
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
        {isLoading ? (
          <LoadingIndicator color="onPrimary" />
        ) : (
          <Trans id={actionText} />
        )}
      </Button>
    </Flex>

    {children}
  </TranslucentBar>
)

export default TopBarWithAction
