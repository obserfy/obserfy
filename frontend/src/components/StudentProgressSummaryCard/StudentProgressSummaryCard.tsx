import React, { FC, useState } from "react"
import { navigate } from "gatsby-plugin-intl3"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import Flex from "../Flex/Flex"
import { categories } from "../../categories"
import Typography from "../Typography/Typography"
import Card from "../Card/Card"
import Tab from "../Tab/Tab"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"
import Pill from "../Pill/Pill"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Box from "../Box/Box"
import InformationalCard from "../InformationalCard/InformationalCard"
import useApi from "../../api/useApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { Area } from "../PageCurriculumArea/PageCurriculumArea"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

export enum MaterialProgressStage {
  UNTOUCHED,
  PRESENTED,
  PRACTICED,
  MASTERED,
}
export interface StudentMaterialProgress {
  areaId: string
  materialName: string
  materialId: string
  stage: MaterialProgressStage
  lastUpdated: Date
}
interface Props {
  studentId: string
}
export const StudentProgressSummaryCard: FC<Props> = ({ studentId }) => {
  const [tab, setTab] = useState(0)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState<
    StudentMaterialProgress
  >()

  const [areas, areasLoading, setAreasOutdated] = useApi<Area[]>(
    `/schools/${getSchoolId()}/curriculum/areas`
  )
  const [progress, progressLoading, setProgressOutdated] = useApi<
    StudentMaterialProgress[]
  >(`/students/${studentId}/materialsProgress`)

  const loading = areasLoading || progressLoading

  const selectedAreaSummaryList = progress
    ?.filter(({ areaId }) => areaId === areas?.[tab].id)
    .map(summary => (
      <SummaryListItem
        value={summary}
        onClick={() => {
          setSelectedSummary(summary)
          setIsEditingLesson(true)
        }}
      />
    ))

  const materialProgressDialog = isEditingLesson && selectedSummary && (
    <StudentMaterialProgressDialog
      progress={selectedSummary}
      onDismiss={() => {
        setAreasOutdated()
        setProgressOutdated()
        setIsEditingLesson(false)
      }}
    />
  )

  const footer = (
    <Flex
      p={2}
      alignItems="center"
      sx={{
        borderTopWidth: 1,
        borderTopColor: "border",
        borderTopStyle: "solid",
      }}
    >
      <Spacer />
      <Button variant="secondary" fontSize={0}>
        See All {categories[tab + 1].name} Progress
      </Button>
    </Flex>
  )

  if (loading) {
    return (
      <Box mt={3}>
        <LoadingPlaceholder width="100%" height="17rem" />
      </Box>
    )
  }

  const isCurriculumDisabled = (areas?.length ?? 0) < 1
  if (isCurriculumDisabled) {
    return (
      <InformationalCard
        message=" Enable the curriculum feature to track student progress in your curriculum."
        buttonText=" Go to Curriculum "
        onButtonClick={() => navigate("/dashboard/settings/curriculum")}
      />
    )
  }

  return (
    <>
      <Card my={3}>
        <Tab
          small
          items={areas?.map(({ name }) => name) ?? []}
          onTabClick={value => setTab(value)}
          selectedItemIdx={tab}
        />
        <Box my={2}>
          {selectedAreaSummaryList}
          {(progress?.length ?? 0) === 0 && (
            <Typography.Body
              width="100%"
              my={4}
              sx={{ textAlign: "center" }}
              color="textMediumEmphasis"
              fontSize={1}
            >
              No materials in progress yet.
            </Typography.Body>
          )}
        </Box>
        {footer}
      </Card>
      {materialProgressDialog}
    </>
  )
}

const SummaryListItem: FC<{
  value: StudentMaterialProgress
  onClick: () => void
}> = ({ value, onClick }) => {
  let status: string
  switch (value.stage) {
    case MaterialProgressStage.MASTERED:
      status = "Mastered"
      break
    case MaterialProgressStage.PRACTICED:
      status = "Practiced"
      break
    case MaterialProgressStage.PRESENTED:
      status = "Presented"
      break
    default:
      status = "N/A"
  }
  return (
    <Flex
      px={3}
      py={2}
      onClick={onClick}
      alignItems="center"
      sx={{
        cursor: "pointer",
        "&:hover ": {
          backgroundColor: "primaryLight",
        },
      }}
    >
      <Typography.Body fontSize={1}>{value.materialName}</Typography.Body>
      <Spacer />
      <Pill backgroundColor="materialStatus.presented" text={status} mr={2} />
      <Icon as={NextIcon} m={0} />
    </Flex>
  )
}

export default StudentProgressSummaryCard
