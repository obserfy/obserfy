import React, { FC } from "react"
import { Box, Flex } from "theme-ui"
import { ReactComponent as EmptyIllustration } from "../../images/report-illustration.svg"
import Typography from "../Typography/Typography"

export interface PageAllReportsProps {}
const PageAllReports: FC<PageAllReportsProps> = () => (
  <Box>
    {/* <Typography.H4 p={4}>Reports</Typography.H4> */}

    <EmptyPlaceholder />
  </Box>
)

const EmptyPlaceholder = () => {
  return (
    <Flex
      sx={{
        flexDirection: ["column-reverse", "column-reverse", "row"],
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box m={3} mr={[3, 3, 5]} sx={{ maxWidth: 400 }}>
        <Typography.H4
          mb={3}
          sx={{ textAlign: ["center", "center", "inherit"], lineHeight: 1.2 }}
        >
          Write progress reports
        </Typography.H4>
        <Typography.Body
          sx={{ textAlign: ["center", "center", "inherit"], fontSize: 2 }}
        >
          Easily write summary of your student&apos;s progress to be shown to
          parents.
        </Typography.Body>
      </Box>

      <EmptyIllustration width="320px" />
    </Flex>
  )
}

export default PageAllReports
