import { Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Card, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import {
  materialStageToString,
  useGetStudentAssessments,
} from "../../hooks/api/useGetStudentAssessments"
import {
  Observation,
  useGetStudentObservations,
} from "../../hooks/api/useGetStudentObservations"
import { ReactComponent as EyeIcon } from "../../icons/eye.svg"
import Icon from "../Icon/Icon"
import ImagePreview from "../ImagePreview/ImagePreview"
import Markdown from "../Markdown/Markdown"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import Pill from "../Pill/Pill"
import Tab from "../Tab/Tab"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

export interface PageStudentReportProps {
  studentId: string
}
const PageStudentReport: FC<PageStudentReportProps> = ({ studentId }) => {
  const observations = useGetStudentObservations(studentId)
  const areas = useGetCurriculumAreas()
  const assessments = useGetStudentAssessments(studentId)
  const [areaIdx, setAreaIdx] = useState(0)
  const student = useGetStudent(studentId)

  const filteredObservations = observations.data?.filter(({ area }) => {
    return area?.id === areas.data?.[areaIdx].id
  })

  const filteredAssessments = assessments.data?.filter(({ areaId }) => {
    return areaId === areas.data?.[areaIdx].id
  })

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TranslucentBar boxSx={{ minHeight: 48 }}>
        <Typography.Body p={3} pb={2} sx={{ fontWeight: "bold", fontSize: 2 }}>
          {student.data?.name}
        </Typography.Body>
      </TranslucentBar>
      <TranslucentBar boxSx={{ position: "sticky", top: 0, height: 44 }}>
        <Tab
          items={areas.data?.map((area) => area.name) ?? []}
          selectedItemIdx={areaIdx}
          onTabClick={setAreaIdx}
        />
      </TranslucentBar>

      <Box
        sx={{
          display: ["block", "block", "block", "flex"],
          width: "100%",
          alignItems: "flex-start",
        }}
        pt={3}
      >
        <Box
          sx={{
            width: "100%",
            position: [undefined, "sticky"],
            top: 60,
            zIndex: 10,
          }}
          pb={3}
        >
          <Card variant="responsive" sx={{ overflow: "hidden" }}>
            <Typography.Body
              sx={{ fontWeight: "bold", ...borderBottom }}
              p={3}
              color="texMediumEmphasis"
            >
              <Trans>Evaluation</Trans>
            </Typography.Body>

            <MarkdownEditor onChange={() => {}} value="" />
          </Card>
        </Box>

        <Box
          sx={{ width: ["auto", "auto", "auto", 640] }}
          p={3}
          pl={[3, 0]}
          pt={0}
        >
          <Typography.H6 sx={{ fontWeight: "bold" }} mb={3}>
            <Trans>Assessments</Trans>
          </Typography.H6>

          {filteredAssessments?.length === 0 && observations.isSuccess && (
            <Card mb={3} sx={{ overflow: "hidden" }} p={3}>
              <Typography.Body>
                <Trans>No assessments has been made yet.</Trans>
              </Typography.Body>
            </Card>
          )}

          {filteredAssessments?.length !== 0 && observations.isSuccess && (
            <Card mb={3} sx={{ overflow: "hidden" }} py={2}>
              {filteredAssessments?.map(({ materialName, stage }) => {
                const stageName = materialStageToString(stage)
                return (
                  <Flex px={3} py={2} sx={{ alignItems: "center" }}>
                    <Typography.Body sx={{ fontSize: 1 }} mr={3}>
                      {materialName}
                    </Typography.Body>
                    <Pill
                      color={`materialStage.on${stageName}`}
                      backgroundColor={`materialStage.${stageName.toLowerCase()}`}
                      text={stageName}
                      mr={2}
                      ml="auto"
                    />
                  </Flex>
                )
              })}
            </Card>
          )}

          <Typography.H6 sx={{ fontWeight: "bold" }} mb={3} mt={4}>
            <Trans>Observations</Trans>
          </Typography.H6>
          {filteredObservations?.length === 0 && observations.isSuccess && (
            <Card mb={3} sx={{ overflow: "hidden" }} p={3}>
              <Typography.Body>
                <Trans>No observation has been added.</Trans>
              </Typography.Body>
            </Card>
          )}

          {filteredObservations?.map((observation) => (
            <ObservationListItem
              key={observation.id}
              observation={observation}
              studentId={studentId}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const ObservationListItem: FC<{
  observation: Observation
  studentId: string
}> = ({ studentId, observation }) => (
  <Card mb={3} sx={{ overflow: "hidden" }}>
    <Box pt={3}>
      <Flex mb={2} mx={3}>
        <Typography.Body
          data-cy="observation-short-desc"
          sx={{ fontWeight: "bold", alignItems: "center" }}
        >
          {observation.shortDesc}
        </Typography.Body>
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
          <Typography.Body
            mb={3}
            mr={1}
            sx={{ fontSize: 0, lineHeight: 1 }}
            color="textPrimary"
          >
            {observation.area.name} {observation.creatorName && "|"}
          </Typography.Body>
        )}
        {observation.creatorName && (
          <Typography.Body
            mb={3}
            sx={{ fontSize: 0, lineHeight: 1 }}
            color="textMediumEmphasis"
          >
            <Trans>By </Trans>
            {` ${observation.creatorName}`}
          </Typography.Body>
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
  </Card>
)

export default PageStudentReport
