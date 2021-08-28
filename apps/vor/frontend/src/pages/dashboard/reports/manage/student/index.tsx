import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { borderBottom, borderFull, borderLeft } from "../../../../../border"
import Icon from "../../../../../components/Icon/Icon"
import ImagePreview from "../../../../../components/ImagePreview/ImagePreview"
import { Link } from "../../../../../components/Link/Link"
import Markdown from "../../../../../components/Markdown/Markdown"
import MarkdownEditor from "../../../../../components/MarkdownEditor/MarkdownEditor"
import Pill from "../../../../../components/Pill/Pill"
import SEO from "../../../../../components/seo"
import Tab from "../../../../../components/Tab/Tab"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../../components/TranslucentBar/TranslucentBar"
import { getFirstName } from "../../../../../domain/person"
import {
  selectComment,
  useComment,
} from "../../../../../domain/report-comments"
import useGetStudentReport from "../../../../../hooks/api/reports/useGetStudentReport"
import usePatchStudentReport from "../../../../../hooks/api/reports/usePatchStudentReport"
import { useGetAllStudents } from "../../../../../hooks/api/students/useGetAllStudents"
import { Area } from "../../../../../hooks/api/useGetArea"
import { useGetCurriculumAreas } from "../../../../../hooks/api/useGetCurriculumAreas"
import {
  MaterialProgress,
  materialStageToString,
  useGetStudentAssessments,
} from "../../../../../hooks/api/useGetStudentAssessments"
import {
  Observation,
  useGetStudentObservations,
} from "../../../../../hooks/api/useGetStudentObservations"
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
  const { data: assessments } = useGetStudentAssessments(studentId)

  let tabs = ["General"]
  if (areas) {
    const areaNames = areas.map(({ name }) => name)
    tabs = tabs.concat(areaNames)
  }

  const [selectedTab, setSelectedTab] = useState(0)
  const selectedArea = selectedTab > 0 ? areas?.[selectedTab - 1] : null

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
          <Box sx={{ height: 65, ...borderBottom }} />
        )}
        <Tab
          small
          items={tabs}
          selectedItemIdx={selectedTab}
          onTabClick={setSelectedTab}
          sx={{ minHeight: 47 }}
        />
      </TranslucentBar>

      {selectedTab === 0 && <GeneralCommentEditor />}
      {selectedArea && (
        <Box
          sx={{
            display: ["block", "block", "block", "flex"],
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <AreaCommentEditor key={selectedArea.id} area={selectedArea} />
          <Box
            pb={6}
            sx={{
              minHeight: "100vh",
              width: ["auto", "auto", "auto", 640],
              ...borderLeft,
            }}
          >
            <Assessments
              assessments={assessments?.filter(
                ({ areaId }) => areaId === selectedArea?.id
              )}
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
          variant="outline"
          mt={[3, 0]}
          mr={3}
          sx={{ width: ["100%", "auto"] }}
        >
          <Trans>Save</Trans>
        </Button>

        <Button
          onClick={handleToggleReady}
          mt={[2, 0]}
          sx={{
            width: ["100%", "auto"],
            backgroundColor: ready ? "tintWarning" : "primary",
            color: ready ? "onWarning" : "onPrimary",
            "&:hover": {
              backgroundColor: ready ? "warning" : "primaryDark",
            },
            "&:focus": {
              backgroundColor: ready ? "warning" : "primaryDark",
            },
          }}
        >
          Mark as {ready && "not"} ready
        </Button>
      </Flex>
    </>
  )
}

const GeneralCommentEditor: FC = () => {
  const studentId = useQueryString("studentId")
  const reportId = useQueryString("reportId")

  const comment = useComment(selectComment(reportId, studentId, "general"))
  const setComment = useComment((state) => state.setComment)

  return (
    <Box
      px={[0, 3]}
      py={3}
      sx={{ width: "100%", top: 0, position: ["relative", "sticky"] }}
    >
      <Box
        sx={{
          borderRadius: [0, "default"],
          backgroundColor: "surface",
          ...borderFull,
          borderStyle: ["none", "solid"],
        }}
      >
        <Text
          px={3}
          pt={3}
          color="textMediumEmphasis"
          sx={{ display: "block", fontWeight: "bold" }}
        >
          <Trans>General Comments</Trans>
        </Text>
        <MarkdownEditor
          placeholder="Add some details"
          value={comment}
          onChange={(value) => {
            setComment(reportId, studentId, "general", value)
          }}
        />
      </Box>
    </Box>
  )
}

const AreaCommentEditor: FC<{ area: Area }> = ({ area }) => {
  const studentId = useQueryString("studentId")
  const reportId = useQueryString("reportId")

  const comment = useComment(selectComment(reportId, studentId, area.id))
  const setComment = useComment((state) => state.setComment)

  return (
    <Box
      px={[0, 3]}
      py={3}
      sx={{ width: "100%", top: 0, position: ["relative", "sticky"] }}
    >
      <Box
        sx={{
          borderRadius: [0, "default"],
          backgroundColor: "surface",
          ...borderFull,
          borderStyle: ["none", "solid"],
        }}
      >
        <Text
          px={3}
          pt={3}
          color="textMediumEmphasis"
          sx={{ display: "block", fontWeight: "bold" }}
        >
          <Trans>Comments on {area.name}</Trans>
        </Text>
        <MarkdownEditor
          placeholder="Add some details"
          value={comment}
          onChange={(value) => {
            setComment(reportId, studentId, area.id, value)
          }}
        />
      </Box>
    </Box>
  )
}

const Assessments: FC<{
  assessments?: MaterialProgress[]
}> = ({ assessments = [] }) => (
  <>
    <ListHeading text={t`Assessments`} />
    {assessments.length === 0 && <NoAssessments />}
    {assessments.length !== 0 && (
      <Box>
        {assessments?.map(({ materialId, materialName, stage }) => {
          const stageName = materialStageToString(stage)
          return (
            <Flex
              key={materialId}
              px={3}
              py={2}
              sx={{ alignItems: "center", ...borderBottom }}
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
  </>
)

const Observations: FC<{
  observations?: Observation[]
  studentId: string
}> = ({ observations = [], studentId }) => (
  <>
    <ListHeading text={t`Observations`} />

    {observations.length === 0 && <NoObservation />}
    {observations.map((observation) => (
      <ObservationItem
        key={observation.id}
        observation={observation}
        studentId={studentId}
      />
    ))}
  </>
)

const ObservationItem: FC<{
  observation: Observation
  studentId: string
}> = ({ studentId, observation }) => (
  <Box pt={3} sx={borderBottom}>
    <Flex mb={2} mx={3}>
      <Text
        data-cy="observation-short-desc"
        sx={{ fontWeight: "bold", alignItems: "center" }}
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
  <Box p={3} pt={4} sx={{ width: "100%", ...borderBottom }}>
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
  <Text p={3} sx={{ display: "block", ...borderBottom }}>
    <Trans>No assessments has been made yet.</Trans>
  </Text>
)

const NoObservation = () => (
  <Text mb={3} sx={{ display: "block", overflow: "hidden" }} p={3}>
    <Trans>No observation has been added.</Trans>
  </Text>
)

export default StudentReports
