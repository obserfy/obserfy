import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Flex, Image, Text } from "theme-ui"
import { Class } from "../../../../__generated__/models"
import { borderBottom, borderFull } from "../../../../border"
import { Link } from "../../../../components/Link/Link"
import SearchBar from "../../../../components/SearchBar/SearchBar"
import SEO from "../../../../components/seo"
import StudentPicturePlaceholder from "../../../../components/StudentPicturePlaceholder/StudentPicturePlaceholder"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../components/TranslucentBar/TranslucentBar"
import useGetReport from "../../../../hooks/api/reports/useGetProgressReport"
import { useQueryString } from "../../../../hooks/useQueryString"
import { ALL_REPORT_URL, STUDENT_REPORT_URL } from "../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const report = useGetReport(reportId)
  const [search, setSearch] = useState("")

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <SEO title="Progress Reports" />

      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ ...borderBottom }}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title),
          ]}
        />

        <Flex
          py={3}
          sx={{
            flexDirection: ["column", "row"],
            alignItems: ["start", "baseline"],
          }}
        >
          <Text ml={3} pb={[1, 0]} sx={{ fontWeight: "bold" }}>
            {report.data?.title}
          </Text>

          <Text
            ml={3}
            mr="auto"
            color="textMediumEmphasis"
            sx={{ fontSize: 0 }}
          >
            {report.data?.periodStart.format("DD MMMM YYYY")} -{" "}
            {report.data?.periodStart.format("DD MMMM YYYY")}
          </Text>

          <Flex
            mt={[3, 0]}
            sx={{ width: ["100%", "auto"], alignItems: "center" }}
          >
            <Text
              ml={3}
              color="textMediumEmphasis"
              sx={{ fontSize: 0, display: "block" }}
              mr="auto"
            >
              <Trans>
                0 out of {report.data?.studentsReports?.length} done
              </Trans>
            </Text>

            <Button mx={3}>
              <Trans>Publish</Trans>
            </Button>
          </Flex>
        </Flex>
      </TranslucentBar>

      <Flex p={3} sx={{ ...borderBottom }}>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      </Flex>

      {report.data?.studentsReports
        ?.filter(({ student }) => student.name.match(new RegExp(search, "i")))
        ?.map(({ student: { id, name, classes } }) => (
          <Student
            key={id}
            reportId={reportId}
            studentId={id}
            name={name}
            classes={classes}
          />
        ))}
    </Box>
  )
}

const Student: FC<{
  image?: string
  reportId: string
  studentId: string
  name: string
  classes: Class[]
}> = ({ image, name, reportId, studentId, classes }) => (
  <Link
    to={STUDENT_REPORT_URL(reportId, studentId)}
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      ...borderBottom,
      "&:hover": {
        backgroundColor: "primaryLightest",
      },
    }}
  >
    {image ? (
      <Image src={image} sx={{ ml: 3, width: 24, flexShrink: 0 }} />
    ) : (
      <StudentPicturePlaceholder sx={{ ml: 3, width: 24, flexShrink: 0 }} />
    )}

    <Text mr="auto" p={3} className="truncate">
      {name}
    </Text>

    {classes.map((c) => (
      <Text
        key={c.id}
        mr={3}
        color="textMediumEmphasis"
        py={1}
        px={2}
        sx={{
          ...borderFull,
          fontSize: 0,
          borderRadius: "circle",
          backgroundColor: "background",
          display: ["none", "block"],
          flexShrink: 0,
        }}
      >
        {c.name}
      </Text>
    ))}

    <Flex
      mr={3}
      py={1}
      px={2}
      sx={{
        ...borderFull,
        borderRadius: "circle",
        backgroundColor: "background",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        sx={{
          mr: "8px",
          width: "6px",
          height: "6px",
          backgroundColor: "red",
          borderRadius: "circle",
          color: "textMediumEmphasis",
        }}
      />

      <Text sx={{ fontSize: 0 }}>Empty</Text>
    </Flex>
  </Link>
)

export default ManageReports
