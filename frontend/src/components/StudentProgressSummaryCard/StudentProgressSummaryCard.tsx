import React, { FC, useState } from "react"
import { Link, navigate } from "gatsby-plugin-intl3"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Card from "../Card/Card"
import Tab from "../Tab/Tab"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"
import Pill from "../Pill/Pill"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Box from "../Box/Box"
import InformationalCard from "../InformationalCard/InformationalCard"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import {
  materialStageToString,
  StudentMaterialProgress,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"

interface Props {
  studentId: string
}
export const StudentProgressSummaryCard: FC<Props> = ({ studentId }) => {
  const [tab, setTab] = useState(0)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState<
    StudentMaterialProgress
  >()
  const [areas, areasLoading, setAreasOutdated] = useGetCurriculumAreas()
  const [
    progress,
    progressLoading,
    setProgressOutdated,
  ] = useGetStudentMaterialProgress(studentId)

  const loading = areasLoading || progressLoading

  const selectedAreaId = areas?.[tab]?.id

  const selectedAreaProgress = progress
    ?.filter(({ areaId }) => areaId === selectedAreaId)
    .map(summary => (
      <ProgressList
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
      <Link
        to={`/dashboard/students/progress?studentId=${studentId}&areaId=${selectedAreaId}`}
      >
        <Button variant="secondary" fontSize={0}>
          See All {areas[tab]?.name} Progress
        </Button>
      </Link>
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
          {selectedAreaProgress}
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

const ProgressList: FC<{
  value: StudentMaterialProgress
  onClick: () => void
}> = ({ value, onClick }) => {
  const stage = materialStageToString(value.stage)

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
      <Pill backgroundColor="materialStatus.presented" text={stage} mr={2} />
      <Icon as={NextIcon} m={0} />
    </Flex>
  )
}

export default StudentProgressSummaryCard
