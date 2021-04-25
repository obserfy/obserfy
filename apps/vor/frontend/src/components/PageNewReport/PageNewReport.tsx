import { t, Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Flex } from "theme-ui"
import dayjs from "../../dayjs"
import usePostNewReport from "../../hooks/api/schools/usePostNewReport"
import { ALL_REPORT_URL } from "../../routes"
import DateInput from "../DateInput/DateInput"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import { breadCrumb } from "../TopBar/TopBar"
import TopBarWithAction from "../TopBarWithAction/TopBarWithAction"
import Typography from "../Typography/Typography"

export interface PageNewReportProps {
}

const PageNewReport: FC<PageNewReportProps> = () => {
  const [title, setTitle] = useState("")
  const [periodStart, setPeriodStart] = useState(dayjs())
  const [periodEnd, setPeriodEnd] = useState(dayjs())

  const postReport = usePostNewReport()

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <TopBarWithAction
        breadcrumbs={[
          breadCrumb(t`Reports`, ALL_REPORT_URL),
          breadCrumb(t`New Progress Report`),
        ]}
        actionText={t`Create`}
        disableAction={title === ""}
        isLoading={postReport.isLoading}
        onActionClick={async () => {
          const result = await postReport.mutateAsync({
            title,
            periodEnd: periodEnd.toISOString(),
            periodStart: periodEnd.toISOString(),
          })
          if (result?.ok) {
            navigate(ALL_REPORT_URL)
          }
        }}
      >
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} mx="auto">
          <Typography.H5 m={3}>
            <Trans>New Progress Report</Trans>
          </Typography.H5>
        </Flex>
      </TopBarWithAction>

      <Box mx="auto" sx={{ maxWidth: "maxWidth.sm", width: "100%" }}>
        <Input
          containerSx={{ px: 3, pt: 3 }}
          label={t`Title*`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Flex p={3} sx={{ flexDirection: ["column", "row"] }}>
          <DateInput
            label={t`Period Start`}
            containerSx={{ mr: [0, 3], flexGrow: 1 }}
            value={periodStart}
            onChange={setPeriodStart}
          />
          <DateInput
            label={t`Period End`}
            onChange={setPeriodEnd}
            value={periodEnd}
            containerSx={{ mt: [3, 0], flexGrow: 1 }}
          />
        </Flex>
      </Box>
    </Flex>
  )
}

export default PageNewReport
