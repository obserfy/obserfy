import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
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
          Write reports
        </Typography.H4>
        <Typography.Body
          mb={3}
          sx={{
            textAlign: ["center", "center", "inherit"],
            fontSize: 2,
            color: "textMediumEmphasis",
          }}
        >
          Easily write reports for parents with all the data that you need in
          one place.
        </Typography.Body>

        <Button>Start your first reports</Button>
      </Flex>

      <EmptyIllustration width="320px" />
    </Flex>
  )
}

export default PageAllReports
