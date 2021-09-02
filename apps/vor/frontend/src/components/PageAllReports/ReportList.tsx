import { FC } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { ProgressReport } from "../../__generated__/models"
import { borderBottom, borderFull, borderTop } from "../../border"
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
        <Flex
          px={[3, 0]}
          py={3}
          mx="auto"
          sx={{ alignItems: "center", maxWidth: "maxWidth.lg" }}
        >
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

      <Box
        mt={3}
        mx={[0, "auto"]}
        sx={{
          ...borderFull,
          borderLeftStyle: ["none", "solid"],
          borderRightStyle: ["none", "solid"],
          borderRadius: [0, "default"],
          backgroundColor: "surface",
          maxWidth: "maxWidth.lg",
          overflow: "hidden",
        }}
      >
        <Flex p={3} sx={{ backgroundColor: "darkSurface" }}>
          <Text color="textMediumEmphasis" sx={{ width: "65%" }}>
            Title
          </Text>
          <Text
            color="textMediumEmphasis"
            sx={{ width: "20%", display: ["none", "block"] }}
          >
            Start Date
          </Text>
          <Text color="textMediumEmphasis" sx={{ width: "5%" }}>
            Status
          </Text>
        </Flex>
        {reports.map((report) => (
          <Link
            to={MANAGE_REPORT_URL(report.id)}
            key={report.id}
            sx={{
              p: 3,
              ...borderTop,
              display: "flex",
              width: "100%",
              alignItems: "center",
              flexWrap: "wrap",
              "&:hover": {
                backgroundColor: "primaryLightest",
              },
            }}
          >
            <Text
              color="textMediumEmphasis"
              sx={{ fontWeight: "bold", width: "65%" }}
            >
              {report.title}
            </Text>
            <Text sx={{ width: "20%", display: ["none", "block"] }}>
              {dayjs(report.periodStart).format("DD MMM YYYY")}
            </Text>
            {report.published ? (
              <Flex
                px={2}
                sx={{
                  ...borderFull,
                  borderRadius: "circle",
                  alignItems: "baseline",
                }}
              >
                <Box
                  mb={1}
                  mr={2}
                  sx={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "primaryDark",
                    borderRadius: "circle",
                  }}
                />
                <Text sx={{ fontSize: 0, width: "10%", color: "primaryDark" }}>
                  Published
                </Text>
              </Flex>
            ) : (
              <Flex
                px={2}
                sx={{
                  ...borderFull,
                  borderRadius: "circle",
                  alignItems: "baseline",
                }}
              >
                <Box
                  mb={1}
                  mr={2}
                  sx={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "warning",
                    borderRadius: "circle",
                  }}
                />
                <Text sx={{ fontSize: 0, width: "15%", color: "warning" }}>
                  Unpublished
                </Text>
              </Flex>
            )}

            <Text
              color="textMediumEmphasis"
              mt={1}
              sx={{ width: "100%", display: ["block", "none"] }}
            >
              {dayjs(report.periodStart).format("DD MMM YYYY")}
            </Text>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

export default ReportList
