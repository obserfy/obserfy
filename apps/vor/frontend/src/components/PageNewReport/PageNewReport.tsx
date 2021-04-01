import { t } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Flex } from "theme-ui"
import { ALL_REPORT_URL } from "../../routes"
import Input from "../Input/Input"
import { breadCrumb } from "../TopBar/TopBar"
import TopBarWithAction from "../TopBarWithAction/TopBarWithAction"
import Typography from "../Typography/Typography"

export interface PageNewReportProps {}
const PageNewReport: FC<PageNewReportProps> = () => (
  <Flex sx={{ flexDirection: "column" }}>
    <TopBarWithAction
      breadcrumbs={[
        breadCrumb("Reports", ALL_REPORT_URL),
        breadCrumb("New Report"),
      ]}
      onActionClick={() => {}}
      buttonContent="Save"
    >
      <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} mx="auto">
        <Typography.H5 m={3}>New Report</Typography.H5>
      </Flex>
    </TopBarWithAction>

    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm", width: "100%" }}>
      <Input containerSx={{ p: 3 }} label={t`Name`} />
    </Box>
  </Flex>
)

export default PageNewReport
