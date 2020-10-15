import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { i18nMark } from "@lingui/core"
import { Trans } from "@lingui/macro"
import { Link } from "../Link/Link"
import Spacer from "../Spacer/Spacer"
import Typography from "../Typography/Typography"

import Tab from "../Tab/Tab"
import StudentMaterialProgressDialog from "../StudentMaterialProgressDialog/StudentMaterialProgressDialog"

import InformationalCard from "../InformationalCard/InformationalCard"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import {
  MaterialProgress,
  MaterialProgressStage,
  useGetStudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import MaterialProgressItem from "./MaterialProgressItem"
import { ADMIN_CURRICULUM_URL, STUDENT_PROGRESS_URL } from "../../routes"

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
  const inSelectedArea = progress.data?.filter(
    (p) => p.areaId === selectedAreaId
  )
  const inProgress = inSelectedArea?.filter(
    ({ stage }) =>
      stage >= MaterialProgressStage.PRESENTED &&
      stage < MaterialProgressStage.MASTERED
  )
  const recentlyMastered = inSelectedArea?.filter(
    ({ stage }) => stage === MaterialProgressStage.MASTERED
  )

  const isFetchingData =
    areas.status === "loading" || progress.status === "loading"
  const isAreaEmpty = (areas.data?.length ?? 0) < 1
  const isProgressEmpty = (inProgress?.length ?? 0) === 0

  // Loading view
  if (isFetchingData && isAreaEmpty) {
    return (
      <Box mt={3}>
        <LoadingPlaceholder
          sx={{ height: "17rem", width: "100%", borderRadius: [0, "default"] }}
        />
      </Box>
    )
  }

  // Disabled curriculum view
  if (!isFetchingData && isAreaEmpty) {
    return (
      <Box mx={[0, 3]}>
        <InformationalCard
          message={i18nMark(
            "You can enable the curriculum feature to track student progress in your curriculum."
          )}
          buttonText={i18nMark(" Go to Curriculum ")}
          to={ADMIN_CURRICULUM_URL}
        />
      </Box>
    )
  }

  // Fully functional view
  const emptyProgressPlaceholder = isProgressEmpty && (
    <Typography.Body
      my={4}
      sx={{
        fontSize: 1,
        width: "100%",
        textAlign: "center",
      }}
      color="textMediumEmphasis"
    >
      <Trans>No materials in progress.</Trans>
    </Typography.Body>
  )

  const listOfInProgress = inProgress?.map((item) => (
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
    .map((item) => (
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
    <Flex p={2} sx={{ alignItems: "center" }}>
      <Spacer />
      <Link to={STUDENT_PROGRESS_URL(studentId, selectedAreaId ?? "")}>
        <Button variant="secondary" sx={{ fontSize: 1 }}>
          <Trans>See All {areas.data?.[tab]?.name} Progress</Trans>
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
    />
  )

  return (
    <>
      <Card sx={{ borderRadius: [0, "default"], overflow: "inherit" }}>
        <Tab
          small
          items={areas.data?.map(({ name }) => name) ?? []}
          onTabClick={setTab}
          selectedItemIdx={tab}
        />
        <Box my={2}>
          {(inProgress?.length ?? 0) > 0 && (
            <Typography.Body
              mt={4}
              mx={3}
              sx={{ fontSize: 0, color: "textMediumEmphasis" }}
            >
              <Trans>In Progress</Trans>
            </Typography.Body>
          )}
          {listOfInProgress}
          {emptyProgressPlaceholder}
          {(listOfMastered?.length ?? 0) > 0 && (
            <Typography.Body
              mt={4}
              mx={3}
              sx={{ fontSize: 0, color: "textMediumEmphasis" }}
            >
              <Trans>Recently Mastered</Trans>
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
