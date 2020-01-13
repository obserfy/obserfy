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

export enum MaterialProgressStatus {
  UNTOUCHED,
  PRESENTED,
  PRACTICED,
  MASTERED,
}
export interface ProgressSummary {
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

  const [areas, setAreasOutdated, areasLoading] = useApi(
    `/schools/${getSchoolId()}/curriculum/areas`
  )

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

  const materialProgressDialog = isEditingLesson && selectedSummary && (
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
      {(areas?.length ?? 0) < 1 ? (
        <InformationalCard
          message=" Enable the curriculum feature to track student progress in your curriculum."
          buttonText=" Go to Curriculum "
          onButtonClick={() => {
            navigate("/dashboard/settings/curriculum")
          }}
        />
      ) : (
        <Card my={3}>
          <Tab
            small
            items={areas.map(({ name }) => name)}
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
