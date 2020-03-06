import React, { FC, useState } from "react"
import { Link, navigate } from "gatsby-plugin-intl3"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Card from "../Card/Card"
import Tab from "../Tab/Tab"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"
import Box from "../Box/Box"
import InformationalCard from "../InformationalCard/InformationalCard"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import {
  MaterialProgress,
  MaterialProgressStage,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import MaterialProgressItem from "./MaterialProgressItem"

interface Props {
  studentId: string
}
export const StudentProgressSummaryCard: FC<Props> = ({ studentId }) => {
  const [tab, setTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [selected, setSelected] = useState<MaterialProgress>()
  const areas = useGetCurriculumAreas()
  const progress = useGetStudentMaterialProgress(studentId)

  // Derived state
  const selectedAreaId = areas.data?.[tab]?.id
  const inSelectedArea = progress.data?.filter(p => p.areaId === selectedAreaId)
  const inProgress = inSelectedArea?.filter(
    ({ stage }) =>
      stage >= MaterialProgressStage.PRESENTED &&
      stage < MaterialProgressStage.MASTERED
  )
  const recentlyMastered = inSelectedArea?.filter(
    ({ stage }) => stage === MaterialProgressStage.MASTERED
  )

  const isFetchingData = areas.isFetching || progress.isFetching
  const isAreaEmpty = (areas.data?.length ?? 0) < 1
  const isProgressEmpty = (inProgress?.length ?? 0) === 0

  // Loading view
  if (isFetchingData && isAreaEmpty) {
    return (
      <Box mt={3}>
        <LoadingPlaceholder width="100%" height="17rem" />
      </Box>
    )
  }

  // Disabled curriculum view
  if (!isFetchingData && isAreaEmpty) {
    return (
      <InformationalCard
        message="You can enable the curriculum feature to track student progress in your curriculum."
        buttonText=" Go to Curriculum "
        onButtonClick={() => navigate("/dashboard/settings/curriculum")}
      />
    )
  }

  // Fully functional view
  const emptyProgressPlaceholder = isProgressEmpty && (
    <Typography.Body
      width="100%"
      my={4}
      sx={{ textAlign: "center" }}
      color="textMediumEmphasis"
      fontSize={1}
    >
      No materials in progress.
    </Typography.Body>
  )

  const listOfInProgress = inProgress?.map(item => (
    <MaterialProgressItem
      key={item.materialId}
      value={item}
      onClick={() => {
        setSelected(item)
        setIsEditing(true)
      }}
    />
  ))

  const listOfMastered = recentlyMastered
    ?.slice(0, 3)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .map(item => (
      <MaterialProgressItem
        key={item.materialId}
        value={item}
        onClick={() => {
          setSelected(item)
          setIsEditing(true)
        }}
      />
    ))

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
        to={`/dashboard/observe/students/progress?studentId=${studentId}&areaId=${selectedAreaId}`}
      >
        <Button variant="secondary" fontSize={0}>
          See All {areas.data?.[tab]?.name} Progress
        </Button>
      </Link>
    </Flex>
  )

  const materialProgressDialog = isEditing && selected && (
    <StudentMaterialProgressDialog
      studentId={studentId}
      lastUpdated={selected?.updatedAt}
      stage={selected?.stage}
      materialName={selected?.materialName}
      materialId={selected?.materialId}
      onDismiss={() => setIsEditing(false)}
      onSubmitted={() => {
        progress.refetch()
        setIsEditing(false)
      }}
    />
  )

  return (
    <>
      <Card overflow="inherit" borderRadius={[0, "default"]}>
        <Tab
          small
          items={areas.data?.map(({ name }) => name) ?? []}
          onTabClick={setTab}
          selectedItemIdx={tab}
        />
        <Box my={2}>
          {(inProgress?.length ?? 0) > 0 && (
            <Typography.Body
              fontSize={0}
              mt={3}
              mx={3}
              sx={{ letterSpacing: 1.2 }}
            >
              IN PROGRESS
            </Typography.Body>
          )}
          {listOfInProgress}
          {emptyProgressPlaceholder}
          {(listOfMastered?.length ?? 0) > 0 && (
            <Typography.Body
              fontSize={0}
              mt={3}
              mx={3}
              sx={{ letterSpacing: 1.2 }}
            >
              RECENTLY MASTERED
            </Typography.Body>
          )}
          {listOfMastered}
        </Box>
        {footer}
      </Card>
      {materialProgressDialog}
    </>
  )
}

export default StudentProgressSummaryCard
