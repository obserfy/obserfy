/** @jsx jsx */
import { FC } from "react"
import { jsx, Box, Button, Card, Flex } from "theme-ui"
import { ProgressReport } from "../../__generated__/models"
import { borderBottom, borderFull } from "../../border"
import { MANAGE_REPORT_URL, NEW_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"
import dayjs from "../../dayjs"

const ReportList: FC<{ reports: ProgressReport[] }> = ({ reports }) => {
  return (
    <Box>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <Flex px={[3, 4]} pb={3} pt={5} sx={{ alignItems: "center" }}>
          <Typography.H2 sx={{ fontSize: [4, 5] }}>
            Progress Reports
          </Typography.H2>
          <Link to={NEW_REPORT_URL} sx={{ ml: "auto" }}>
            <Button>New</Button>
          </Link>
        </Flex>
      </TranslucentBar>

      <Flex sx={{ flexWrap: "wrap" }} mt={3} mx={[0, 3]}>
        {reports.map((report) => (
          <Link
            to={MANAGE_REPORT_URL(report.id)}
            key={report.id}
            sx={{
              p: 3,
              display: "block",
              width: ["100%", "50%", "25%", "20%"],
            }}
          >
            <Card
              as="article"
              p={3}
              sx={{
                ...borderFull,
                "&:hover": {
                  borderColor: "primary",
                },
              }}
            >
              <Typography.H2 mb={1} sx={{ fontSize: 2 }}>
                {report.title}
              </Typography.H2>
              <Typography.Body>
                {dayjs(report.periodStart).format("MMMM YYYY")}
              </Typography.Body>
            </Card>
          </Link>
        ))}
      </Flex>
    </Box>
  )
}

export default ReportList
