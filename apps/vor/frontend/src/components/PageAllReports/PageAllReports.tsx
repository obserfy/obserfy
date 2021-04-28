import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import useGetReports from "../../hooks/api/useGetReports"
import { ReactComponent as EmptyIllustration } from "../../images/report-illustration.svg"
import { NEW_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import Typography from "../Typography/Typography"

export interface PageAllReportsProps {}

const PageAllReports: FC<PageAllReportsProps> = () => {
  const reports = useGetReports()

  if (reports.isLoading) {
    return <div>Loading</div>
  }

  if (reports.isSuccess) {
    return <Box>{reports.data.length < 0 && <EmptyPlaceholder />}</Box>
  }

  return <div>Error</div>
}

const EmptyPlaceholder = () => {
  return (
    <Flex
      sx={{
        flexDirection: ["column-reverse", "column-reverse", "row"],
        justifyContent: ["flex-end", "center"],
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
      }}
      pt={[4, 0]}
    >
      <Flex
        m={3}
        mr={[3, 3, 5]}
        sx={{
          maxWidth: 400,
          flexDirection: "column",
          alignItems: ["center", "center", "flex-start"],
        }}
      >
        <Typography.H4
          mb={3}
          sx={{ textAlign: ["center", "center", "inherit"], lineHeight: 1.2 }}
        >
          <Trans>Write progress reports</Trans>
        </Typography.H4>
        <Typography.Body
          mb={3}
          my={3}
          sx={{
            textAlign: ["center", "center", "inherit"],
            fontSize: 2,
            color: "textMediumEmphasis",
          }}
        >
          <Trans>
            Easily write reports for parents with all the data that you need in
            one place.
          </Trans>
        </Typography.Body>

        <Link to={NEW_REPORT_URL}>
          <Button>
            <Trans>Start your first report</Trans>
          </Button>
        </Link>
      </Flex>

      <EmptyIllustration width="320px" />
    </Flex>
  )
}

export default PageAllReports
