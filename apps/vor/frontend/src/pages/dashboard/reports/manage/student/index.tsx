import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { borderBottom, borderFull, borderLeft } from "../../../../../border"
import Icon from "../../../../../components/Icon/Icon"
import ImagePreview from "../../../../../components/ImagePreview/ImagePreview"
import Markdown from "../../../../../components/Markdown/Markdown"
import MarkdownEditor from "../../../../../components/MarkdownEditor/MarkdownEditor"
import Pill from "../../../../../components/Pill/Pill"
import SEO from "../../../../../components/seo"
import Tab from "../../../../../components/Tab/Tab"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../../components/TranslucentBar/TranslucentBar"
import { getFirstName } from "../../../../../domain/person"
import useGetReport from "../../../../../hooks/api/reports/useGetProgressReport"
import { Area } from "../../../../../hooks/api/useGetArea"
import { useGetCurriculumAreas } from "../../../../../hooks/api/useGetCurriculumAreas"
import { Student, useGetStudent } from "../../../../../hooks/api/useGetStudent"
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
import { ALL_REPORT_URL, MANAGE_REPORT_URL } from "../../../../../routes"

const StudentReports = () => {
  const studentId = useQueryString("studentId")
  const { data: student } = useGetStudent(studentId)
  const { data: areas } = useGetCurriculumAreas()
  const [areaIdx, setAreaIdx] = useState(0)
  const selectedArea = areas?.[areaIdx]

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <SEO title={`${student?.name} | Progress Report`} />
      <NavigationBar
        areaIdx={areaIdx}
        setAreaIdx={setAreaIdx}
        student={student}
        areas={areas}
      />

      {selectedArea && <Editor key={selectedArea.id} area={selectedArea} />}
    </Box>
  )
}

const NavigationBar: FC<{
  areaIdx: number
  setAreaIdx: (idx: number) => void
  student?: Student
  areas?: Area[]
}> = ({ areaIdx, setAreaIdx, areas = [], student }) => {
  const reportId = useQueryString("reportId")
  const report = useGetReport(reportId)

  return (
    <TranslucentBar>
      <TopBar
        containerSx={borderBottom}
        breadcrumbs={[
          breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
          breadCrumb(report.data?.title, MANAGE_REPORT_URL(reportId)),
          breadCrumb(getFirstName(student)),
        ]}
      />

      <Flex
        p={3}
        sx={{
          ...borderBottom,
          alignItems: ["flex-start", "center"],
          flexDirection: ["column", "row"],
        }}
      >
        <Flex sx={{ alignItems: "center" }} mr="auto">
          <Button variant="outline" p={0}>
            <Icon as={ChevronUp} size={24} />
          </Button>
          <Button variant="outline" p={0} ml={1}>
            <Icon as={ChevronDown} size={24} />
          </Button>
          <Text ml={3} sx={{ fontWeight: "bold", fontSize: 1 }}>
            {student?.name}
          </Text>
        </Flex>

        <Button mt={[3, 0]} sx={{ width: ["100%", "auto"] }}>
          Mark as done
        </Button>
      </Flex>

      <Tab
        small
        items={areas.map(({ name }) => name)}
        selectedItemIdx={areaIdx}
        onTabClick={setAreaIdx}
        sx={{ minHeight: 47 }}
      />
    </TranslucentBar>
  )
}

const Editor: FC<{ area: Area }> = ({ area }) => {
  const studentId = useQueryString("studentId")
  const { data: observations } = useGetStudentObservations(studentId)
  const { data: assessments } = useGetStudentAssessments(studentId)

  const [comments, setComments] = useState("")

  return (
    <Box
      sx={{
        display: ["block", "block", "block", "flex"],
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      <Box px={[0, 3]} py={3} sx={{ width: "100%" }}>
        <Box
          sx={{
            top: 3,
            position: ["relative", "sticky"],
            borderRadius: [0, "default"],
            backgroundColor: "surface",
            ...borderFull,
            borderStyle: ["none", "solid"],
          }}
        >
          <Text
            px={3}
            py={2}
            color="textMediumEmphasis"
            sx={{ display: "block", fontWeight: "bold" }}
          >
            <Trans>Comments on {area.name}</Trans>
          </Text>
          <MarkdownEditor
            onChange={setComments}
            value={comments}
            placeholder="Add some details"
          />
        </Box>
      </Box>

      <Box
        sx={{
          minHeight: "100vh",
          width: ["auto", "auto", "auto", 640],
          ...borderLeft,
        }}
      >
        <Assessments
          assessments={assessments?.filter(({ areaId }) => areaId === area.id)}
        />
        <Observations
          studentId={studentId}
          observations={observations?.filter(
            (observation) => observation.area?.id === area.id
          )}
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
