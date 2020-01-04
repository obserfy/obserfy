import React, { FC, useState } from "react"
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
import { ReactComponent as InfoIcon } from "../../icons/info.svg"
import { addOnlyUniqueValues } from "../../arrayManipulation"
import Box from "../Box/Box"

export enum MaterialProgressStatus {
  UNTOUCHED,
  PRESENTED,
  PRACTICED,
  MASTERED,
}
interface ProgressSummary {
  areaName: string
  materialName: string
  status: MaterialProgressStatus
  presentedDate: Date
}
export const StudentProgressSummaryCard: FC = () => {
  const [tab, setTab] = useState(0)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  const [selectedSummary, setSelectedSummary] = useState<ProgressSummary>()
  const [summaries] = useState<ProgressSummary[]>([])

  const areas = summaries
    .map(({ areaName }) => areaName)
    .reduce<string[]>(addOnlyUniqueValues, [])

  const selectedAreaSummaryList = summaries
    .filter(({ areaName }) => areaName === areas[tab])
    .map(summary => (
      <SummaryListItem
        value={summary}
        onClick={() => {
          setSelectedSummary(summary)
          setIsEditingLesson(true)
        }}
      />
    ))

  const materialProgressDialog = isEditingLesson && (
    <StudentMaterialProgressDialog
      progress={selectedSummary}
      onDismiss={() => setIsEditingLesson(false)}
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

  return (
    <>
      {summaries.length === 0 ? (
        <Box
          p={3}
          mt={3}
          backgroundColor="tintWarning"
          sx={{
            borderWidth: 1,
            borderColor: "warning",
            borderRadius: "default",
          }}
        >
          <Flex alignItems="center">
            <Icon as={InfoIcon} m={0} fill="warning" />
            <Typography.Body fontSize={1} ml={2} color="warning">
              Info
            </Typography.Body>
          </Flex>
          <Typography.Body fontSize={1} pb={2}>
            Enable the curriculum feature to track student progress in your
            curriculum.
          </Typography.Body>
          <Flex>
            <Spacer />
            <Button variant="outline" color="warning" fontSize={0}>
              Go to Curriculum
            </Button>
          </Flex>
        </Box>
      ) : (
        <Card my={3}>
          <Tab
            small
            items={areas}
            onTabClick={value => setTab(value)}
            selectedItemIdx={tab}
          />
          <Box my={2}>{selectedAreaSummaryList}</Box>
          {footer}
        </Card>
      )}
      {materialProgressDialog}
    </>
  )
}

const SummaryListItem: FC<{
  value: ProgressSummary
  onClick: () => void
}> = ({ value, onClick }) => {
  let status: string
  switch (value.status) {
    case MaterialProgressStatus.MASTERED:
      status = "Mastered"
      break
    case MaterialProgressStatus.PRACTICED:
      status = "Practiced"
      break
    case MaterialProgressStatus.PRESENTED:
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
