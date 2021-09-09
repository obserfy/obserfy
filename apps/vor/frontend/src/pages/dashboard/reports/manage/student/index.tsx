import { t, Trans } from "@lingui/macro"
import { FC, useEffect, useState } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { borderBottom, borderFull } from "../../../../../border"
import Icon from "../../../../../components/Icon/Icon"
import ImagePreview from "../../../../../components/ImagePreview/ImagePreview"
import { Link } from "../../../../../components/Link/Link"
import LoadingIndicator from "../../../../../components/LoadingIndicator/LoadingIndicator"
import Markdown from "../../../../../components/Markdown/Markdown"
import MarkdownEditor from "../../../../../components/MarkdownEditor/MarkdownEditor"
import Pill from "../../../../../components/Pill/Pill"
import SEO from "../../../../../components/seo"
import Tab from "../../../../../components/Tab/Tab"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../../components/TranslucentBar/TranslucentBar"
import { getFirstName } from "../../../../../domain/person"
import useGetStudentReport from "../../../../../hooks/api/reports/useGetStudentReport"
import useGetStudentReportAssessmentByArea from "../../../../../hooks/api/reports/useGetStudentReportAssessmentByArea"
import usePatchStudentReport from "../../../../../hooks/api/reports/usePatchStudentReport"
import usePutReportStudentAreaComments from "../../../../../hooks/api/reports/usePutReportStudentAreaComments"
import { useGetAllStudents } from "../../../../../hooks/api/students/useGetAllStudents"
import { Area } from "../../../../../hooks/api/useGetArea"
import { useGetCurriculumAreas } from "../../../../../hooks/api/useGetCurriculumAreas"
import { materialStageToString } from "../../../../../hooks/api/useGetStudentAssessments"
import {
  Observation,
  useGetStudentObservations,
} from "../../../../../hooks/api/useGetStudentObservations"
import useDebounce from "../../../../../hooks/useDebounce"
import { useQueryString } from "../../../../../hooks/useQueryString"
import { ReactComponent as ChevronDown } from "../../../../../icons/chevron-down.svg"
import { ReactComponent as ChevronUp } from "../../../../../icons/chevron-up.svg"
import { ReactComponent as EyeIcon } from "../../../../../icons/eye.svg"
import {
  ALL_REPORT_URL,
  MANAGE_REPORT_URL,
  STUDENT_REPORT_URL,
} from "../../../../../routes"

const StudentReports = () => {
  const reportId = useQueryString("reportId")
  const studentId = useQueryString("studentId")

  const { data: report } = useGetStudentReport(reportId, studentId)
  const { data: areas } = useGetCurriculumAreas()
  const { data: observations } = useGetStudentObservations(studentId)

  const [selectedTab, setSelectedTab] = useState(0)
  const selectedArea = selectedTab > 0 ? areas?.[selectedTab - 1] : null
  let tabs = ["General"]
  if (areas) {
    const areaNames = areas.map(({ name }) => name)
    tabs = tabs.concat(areaNames)
  }

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <SEO title={`${report?.student?.name} | Progress Report`} />

      <TranslucentBar>
        <TopBar
          containerSx={borderBottom}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(
              report?.progressReport?.title,
              MANAGE_REPORT_URL(reportId)
            ),
            breadCrumb(getFirstName(report?.student)),
          ]}
        />
        {report && report.student ? (
          <ActionBar
            studentId={report.student.id}
            studentName={report.student.name}
            ready={report.ready}
          />
        ) : (
          <Box sx={{ height: [107, 65], ...borderBottom }} />
        )}
        <Tab
          small
          items={tabs}
          selectedItemIdx={selectedTab}
          onTabClick={setSelectedTab}
          sx={{ minHeight: 47 }}
        />
      </TranslucentBar>

      {selectedTab === 0 && (
        <GeneralCommentEditor
          key={studentId}
          defaultValue={report?.generalComments}
        />
      )}

      {selectedArea && (
        <Box
          key={selectedArea.id}
          sx={{
            display: ["block", "block", "block", "flex"],
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <AreaCommentEditor
            area={selectedArea}
            defaultValue={
              report?.areaComments.find(
                ({ areaId }) => areaId === selectedArea?.id
              )?.comments
            }
          />
          <Box
            pb={6}
            sx={{
              minHeight: "100vh",
              width: ["auto", "auto", "auto", 600],
            }}
          >
            <Assessments
              areaId={selectedArea.id}
              studentId={studentId}
              reportId={reportId}
            />
            <Observations
              studentId={studentId}
              observations={observations?.filter(
                ({ area }) => area?.id === selectedArea?.id
              )}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

const ActionBar: FC<{
  studentId: string
  studentName: string
  ready: boolean
}> = ({ studentId, studentName, ready }) => {
  const reportId = useQueryString("reportId")
  const { data: students } = useGetAllStudents("", true)

  const patchStudentReport = usePatchStudentReport(reportId, studentId)

  const handleToggleReady = async () => {
    await patchStudentReport.mutate({
      ready: !ready,
    })
  }

  const currentIdx = students?.findIndex(({ id }) => id === studentId)
  const prevStudentId =
    currentIdx !== undefined && currentIdx !== -1
      ? students?.[currentIdx - 1]?.id
      : null
  const nextStudentId =
    currentIdx !== undefined && currentIdx !== -1
      ? students?.[currentIdx + 1]?.id
      : null

  const prevStudentURL = prevStudentId
    ? STUDENT_REPORT_URL(reportId, prevStudentId)
    : null
  const nextStudentURL = nextStudentId
    ? STUDENT_REPORT_URL(reportId, nextStudentId)
    : null

  const prevStudentLink = prevStudentURL ? (
    <Link to={prevStudentURL}>
      <Button variant="outline" p={0}>
        <Icon as={ChevronUp} size={24} />
      </Button>
    </Link>
  ) : (
    <Button variant="outline" p={0} disabled>
      <Icon as={ChevronUp} size={24} />
    </Button>
  )

  const nextStudentLink = nextStudentURL ? (
    <Link to={nextStudentURL}>
      <Button variant="outline" p={0} ml={1}>
        <Icon as={ChevronDown} size={24} />
      </Button>
    </Link>
  ) : (
    <Button variant="outline" p={0} ml={1} disabled>
      <Icon as={ChevronDown} size={24} />
    </Button>
  )

  return (
    <>
      <Flex
        p={3}
        sx={{
          ...borderBottom,
          alignItems: ["flex-start", "center"],
          flexDirection: ["column", "row"],
        }}
      >
        <Flex sx={{ alignItems: "center" }} mr="auto">
          {prevStudentLink}
          {nextStudentLink}

          <Text ml={3} sx={{ fontWeight: "bold", fontSize: 1 }}>
            {studentName}
          </Text>
        </Flex>

        <Button
          variant={ready ? "outline" : "primary"}
          onClick={handleToggleReady}
          mt={[3, 0]}
          sx={{
            width: ["100%", "auto"],
            color: ready ? "warning" : "onPrimary",
          }}
        >
          <Trans>Mark as {ready ? "not" : ""} ready</Trans>
        </Button>
      </Flex>
    </>
  )
}

const GeneralCommentEditor: FC<{
  defaultValue?: string
}> = ({ defaultValue }) => {
  const studentId = useQueryString("studentId")
  const reportId = useQueryString("reportId")
  const patchStudentReport = usePatchStudentReport(reportId, studentId)

  const [comment, setComment] = useState(defaultValue)
  const debouncedComment = useDebounce(comment, 300)

  useEffect(() => {
    if (defaultValue && comment === undefined) {
      setComment(defaultValue)
    } else if (
      debouncedComment !== undefined &&
      debouncedComment !== defaultValue
    ) {
      patchStudentReport.mutate({
        generalComments: debouncedComment,
      })
    }
  }, [debouncedComment, defaultValue])

  return (
    <Box
      px={[0, 3]}
      pt={3}
      pb={6}
      sx={{ width: "100%", top: 0, position: ["relative", "sticky"] }}
    >
      <Box
        sx={{
          borderRadius: [0, "default"],
          backgroundColor: "surface",
          ...borderFull,
          borderLeftStyle: ["none", "solid"],
          borderRightStyle: ["none", "solid"],
        }}
      >
        <Flex
          sx={{
            ...borderBottom,
            alignItems: "center",
            fontSize: 0,
            position: "relative",
          }}
          p={3}
        >
          <Text
            color="textMediumEmphasis"
            sx={{ display: "block", fontWeight: "bold" }}
            mr="auto"
          >
            <Trans>General Comments</Trans>
          </Text>

          <LoadingIndicator
            mr={2}
            sx={{
              opacity: patchStudentReport.isLoading ? 1 : 0,
              transition: "opacity 100ms ease-in-out",
            }}
          />
          <Text
            mr={2}
            color="textMediumEmphasis"
            sx={{
              display: ["none", "block"],
              opacity: patchStudentReport.isLoading ? 1 : 0,
              transition: "opacity 100ms ease-in-out",
            }}
          >
            Autosaving
          </Text>

          <Text
            mr={2}
            color="textMediumEmphasis"
            sx={{
              display: ["none", "block"],
              opacity:
                patchStudentReport.isSuccess && comment === defaultValue
                  ? 1
                  : 0,
              transition: "opacity 100ms ease-in-out",
              position: "absolute",
              right: 2,
            }}
          >
            Saved
          </Text>
        </Flex>
        <MarkdownEditor
          placeholder="Add some details"
          value={comment}
          onChange={setComment}
        />
      </Box>
    </Box>
  )
}

const AreaCommentEditor: FC<{
  area: Area
  defaultValue?: string
}> = ({ area, defaultValue }) => {
  const studentId = useQueryString("studentId")
  const reportId = useQueryString("reportId")
  const putStudentReportAreaComments = usePutReportStudentAreaComments(
    reportId,
    studentId,
    area.id
  )

  const [comment, setComment] = useState(defaultValue)
  const debouncedComment = useDebounce(comment, 300)

  useEffect(() => {
    if (defaultValue && comment === undefined) {
      setComment(defaultValue)
    } else if (
      debouncedComment !== undefined &&
      debouncedComment !== defaultValue
    ) {
      putStudentReportAreaComments.mutate({
        comments: debouncedComment,
      })
    }
  }, [debouncedComment, defaultValue])

  return (
    <Box
      px={[0, 3]}
      py={3}
      sx={{
        width: "100%",
        top: 0,
        position: ["relative", "relative", "relative", "sticky"],
      }}
    >
      <Box
        sx={{
          borderRadius: [0, "default"],
          backgroundColor: "surface",
          ...borderFull,
          borderLeftStyle: ["none", "solid"],
          borderRightStyle: ["none", "solid"],
        }}
      >
        <Flex
          sx={{
            ...borderBottom,
            alignItems: "center",
            fontSize: 0,
            position: "relative",
          }}
          p={3}
        >
          <Text
            mr="auto"
            color="textMediumEmphasis"
            sx={{ display: "block", fontWeight: "bold" }}
          >
            <Trans>Comments on {area.name}</Trans>
          </Text>

          <LoadingIndicator
            mr={2}
            sx={{
              opacity: putStudentReportAreaComments.isLoading ? 1 : 0,
              transition: "opacity 100ms ease-in-out",
            }}
          />
          <Text
            mr={2}
            color="textMediumEmphasis"
            sx={{
              display: ["none", "block"],
              opacity: putStudentReportAreaComments.isLoading ? 1 : 0,
              transition: "opacity 100ms ease-in-out",
            }}
          >
            Autosaving
          </Text>

          <Text
            mr={2}
            color="textMediumEmphasis"
            sx={{
              display: ["none", "block"],
              opacity:
                putStudentReportAreaComments.isSuccess &&
                comment === defaultValue
                  ? 1
                  : 0,
              transition: "opacity 100ms ease-in-out",
              position: "absolute",
              right: 2,
            }}
          >
            Saved
          </Text>
        </Flex>

        <MarkdownEditor
          placeholder="Add some details"
          value={comment}
          onChange={setComment}
        />
      </Box>
    </Box>
  )
}

const Assessments: FC<{
  reportId: string
  studentId: string
  areaId: string
}> = ({ areaId, studentId, reportId }) => {
  const { data: assessments } = useGetStudentReportAssessmentByArea(
    reportId,
    studentId,
    areaId
  )

  return (
    <Box
      mt={3}
      mr={[0, 3]}
      ml={[0, 3, 3, 0]}
      sx={{
        borderRadius: [0, "default"],
        backgroundColor: "surface",
        ...borderFull,
        borderLeftStyle: ["none", "solid"],
        borderRightStyle: ["none", "solid"],
      }}
    >
      <ListHeading text={t`Assessments`} />
      {assessments?.length === 0 && <NoAssessments />}
      {assessments?.length !== 0 && (
        <Box>
          {assessments?.map(({ materialId, materialName, assessment }) => {
            const stageName = materialStageToString(assessment)
            return (
              <Flex
                key={materialId}
                px={3}
                py={2}
                sx={{
                  alignItems: "center",
                  "&:not(:last-child)": {
                    ...borderBottom,
                  },
                }}
              >
                <Text sx={{ fontSize: 0 }} mr={3}>
                  {materialName}
                </Text>
                <Pill
                  color={`materialStage.on${stageName}`}
                  backgroundColor={`materialStage.${stageName.toLowerCase()}`}
                  text={stageName}
                  ml="auto"
                />
              </Flex>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

const Observations: FC<{
  observations?: Observation[]
  studentId: string
}> = ({ observations = [], studentId }) => (
  <Box
    mt={3}
    mr={[0, 3]}
    ml={[0, 3, 3, 0]}
    sx={{
      borderRadius: [0, "default"],
      backgroundColor: "surface",
      ...borderFull,
      borderLeftStyle: ["none", "solid"],
      borderRightStyle: ["none", "solid"],
    }}
  >
    <ListHeading text={t`Observations`} />

    {observations.length === 0 && <NoObservation />}
    {observations.map((observation) => (
      <ObservationItem
        key={observation.id}
        observation={observation}
        studentId={studentId}
      />
    ))}
  </Box>
)

const ObservationItem: FC<{
  observation: Observation
  studentId: string
}> = ({ studentId, observation }) => (
  <Box
    pt={3}
    sx={{
      "&:not(:last-child)": {
        ...borderBottom,
      },
    }}
  >
    <Flex mb={2} mx={3}>
      <Text
        data-cy="observation-short-desc"
        sx={{ fontSize: 0, fontWeight: "bold", alignItems: "center" }}
      >
        {observation.shortDesc}
      </Text>
      {observation.visibleToGuardians && <Icon as={EyeIcon} ml="auto" />}
    </Flex>

    {observation.longDesc && (
      <Markdown
        mx={3}
        mb={3}
        data-cy="observation-long-desc"
        markdown={observation.longDesc}
        sx={{
          fontSize: 0,
        }}
      />
    )}

    <Flex ml={3}>
      {observation.area && (
        <Text
          mb={3}
          mr={1}
          sx={{ fontSize: 0, lineHeight: 1 }}
          color="textPrimary"
        >
          {observation.area.name} {observation.creatorName && "|"}
        </Text>
      )}
      {observation.creatorName && (
        <Text
          mb={3}
          sx={{ fontSize: 0, lineHeight: 1 }}
          color="textMediumEmphasis"
        >
          <Trans>By </Trans>
          {` ${observation.creatorName}`}
        </Text>
      )}
    </Flex>

    <Flex sx={{ alignItems: "baseline", flexWrap: "wrap" }} mx={3}>
      {observation.images.map(({ id, originalUrl, thumbnailUrl }) => (
        <ImagePreview
          studentId={studentId}
          imageId={id}
          key={id}
          id={id}
          originalUrl={originalUrl}
          thumbnailUrl={thumbnailUrl}
          imageSx={{ mr: 2, mb: 3 }}
        />
      ))}
    </Flex>
  </Box>
)

const ListHeading: FC<{ text: string }> = ({ text }) => (
  <Box p={3} sx={{ width: "100%", ...borderBottom }}>
    <Text sx={{ fontWeight: "bold" }}>{text}</Text>
    <Box
      mt={1}
      sx={{
        backgroundColor: "primary",
        height: 4,
        width: 40,
        borderRadius: "circle",
      }}
    />
  </Box>
)

const NoAssessments = () => (
  <Text p={3} sx={{ display: "block" }}>
    <Trans>No assessments has been made yet.</Trans>
  </Text>
)

const NoObservation = () => (
  <Text sx={{ display: "block", overflow: "hidden" }} p={3}>
    <Trans>No observation has been added.</Trans>
  </Text>
)

export default StudentReports
