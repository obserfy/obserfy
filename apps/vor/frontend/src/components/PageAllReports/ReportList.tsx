import { FC } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { ProgressReport } from "../../__generated__/models"
import { borderBottom, borderFull, borderTop } from "../../border"
import dayjs from "../../dayjs"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { MANAGE_REPORT_URL, NEW_REPORT_URL } from "../../routes"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"

const ReportList: FC<{ reports: ProgressReport[] }> = ({ reports }) => {
  return (
    <Box>
      <Box
        sx={{
          ...borderBottom,
          position: "sticky",
          top: 0,
          background:
            "linear-gradient(52deg, rgba(34,90,195,1) 0%, rgba(45,253,130,1) 100%)",
        }}
      >
        <Flex
          px={[3, 3, 0]}
          mx="auto"
          sx={{
            alignItems: "flex-end",
            maxWidth: "maxWidth.lg",
            height: 160,
          }}
        >
          <Text
            as="h1"
            sx={{
              fontSize: 5,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
            }}
            mb={3}
          >
            Progress Reports
          </Text>

          <Link
            to={NEW_REPORT_URL}
            sx={{
              flexShrink: 0,
              ml: "auto",
              mb: -19,
            }}
          >
            <Button
              variant="outline"
              sx={{
                borderRadius: "circle",
                backgroundColor: "tertiary.900",
                color: "onTertiary",
                "&:hover": {
                  backgroundColor: "tertiary.800",
                  borderColor: "tertiary.800",
                },
              }}
            >
              <Icon as={PlusIcon} sx={{ fill: "onTertiary" }} mr={1} />
              Report
            </Button>
          </Link>
        </Flex>
      </Box>

      <Box
        mt={4}
        mx={[0, 3, "auto"]}
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
                  backgroundColor: "surface",
                }}
              >
                <Box
                  mb={1}
                  mr={2}
                  sx={{
                    backgroundColor: "primaryDark",
                    width: "8px",
                    height: "8px",
                    borderRadius: "circle",
                    display: ["none", "block"],
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
                  backgroundColor: "surface",
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
                    display: ["none", "block"],
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
