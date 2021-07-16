import { FC } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { ProgressReport } from "../../__generated__/models"
import { borderBottom, borderFull } from "../../border"
import dayjs from "../../dayjs"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { MANAGE_REPORT_URL, NEW_REPORT_URL } from "../../routes"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

const ReportList: FC<{ reports: ProgressReport[] }> = ({ reports }) => {
  return (
    <Box>
      <TranslucentBar boxSx={{ ...borderBottom, position: "sticky", top: 0 }}>
        <Flex px={[3, 4]} py={3} sx={{ alignItems: "center" }}>
          <Text as="h1" sx={{ fontWeight: "bold" }}>
            Progress Reports
          </Text>
          <Link to={NEW_REPORT_URL} sx={{ ml: "auto" }}>
            <Button>
              <Icon as={PlusIcon} sx={{ fill: "onPrimary" }} mr={1} />
              New Report
            </Button>
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
              py: [2, 3],
              display: "block",
              width: ["100%", "50%", "25%"],
            }}
          >
            <Flex
              as="article"
              p={3}
              sx={{
                ...borderFull,
                borderRadius: "default",
                backgroundColor: "surface",
                alignItems: "center",
                "&:hover": {
                  borderColor: "primary",
                },
              }}
            >
              <Text mb={1} sx={{ fontSize: 1 }}>
                {report.title}
              </Text>
              <Text color="textMediumEmphasis" ml="auto" sx={{ fontSize: 1 }}>
                {dayjs(report.periodEnd).format("MMMM YYYY")}
              </Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Box>
  )
}

export default ReportList
