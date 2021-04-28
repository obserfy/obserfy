/** @jsx jsx */
import { FC } from "react"
import { jsx, Box, Button, Card, Flex } from "theme-ui"
import { ProgressReport } from "../../__generated__/models"
import { borderBottom, borderFull } from "../../border"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"

const ReportList: FC<{ reports: ProgressReport[] }> = ({ reports }) => {
  return (
    <Box>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <Flex px={[3, 4]} pb={3} pt={5} sx={{ alignItems: "center" }}>
          <Typography.H2 sx={{ fontSize: [4, 5] }}>
            Progress Reports
          </Typography.H2>
          <Button ml="auto">New</Button>
        </Flex>
      </TranslucentBar>

      <Flex sx={{ flexWrap: "wrap" }} mt={3} mx={[0, 3]}>
        {reports.map((report) => (
          <Link
            to="/"
            key={report.id}
            sx={{
              p: 3,
              display: "block",
              width: ["100%", "50%", "25%", "20%"],
            }}
          >
            <Card
              p={3}
              sx={{
                ...borderFull,
                "&:hover": {
                  borderColor: "primary",
                },
              }}
            >
              {report.title}
            </Card>
          </Link>
        ))}
      </Flex>
    </Box>
  )
}

export default ReportList
