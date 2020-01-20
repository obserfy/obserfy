import React, { FC, useState } from "react"
import { useIntl } from "gatsby-plugin-intl3"
import { MaterialProgressStage } from "../../api/useGetStudentMaterialProgress"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Select from "../Select/Select"
import Box from "../Box/Box"
import { updateStudentMaterialProgress } from "../../api/updateStudentMaterialProgress"

export const StudentMaterialProgressDialog: FC<{
  studentId: string
  // material?: Material
  // progress?: MaterialProgress
  materialId: string
  materialName: string
  stage?: number
  lastUpdated?: string
  onDismiss: () => void
  onSubmitted: () => void
}> = ({
  materialId,
  materialName,
  stage,
  lastUpdated,
  onSubmitted,
  studentId,
  onDismiss,
  // progress,
}) => {
  const [selectedStage, setSelectedStage] = useState(stage)
  const intl = useIntl()
  const subtext = `Last updated ${intl.formatDate(lastUpdated, {
    month: "short",
    day: "2-digit",
    weekday: "long",
  })}`

  async function submitProgressUpdate(): Promise<void> {
    if (selectedStage === undefined) return
    const response = await updateStudentMaterialProgress(
      studentId,
      materialId,
      { stage: selectedStage }
    )
    if (response.status === 200) {
      onSubmitted()
    }
  }

  return (
    <ScrollableDialog
      title={materialName}
      positiveText="Save changes"
      onDismiss={onDismiss}
      onPositiveClick={submitProgressUpdate}
      negativeText="Cancel"
      onNegativeClick={onDismiss}
      subtext={subtext}
      disablePositiveButton={selectedStage === stage}
    >
      <Box m={3} mb={4}>
        <Select
          label="Progress"
          value={selectedStage ?? -1}
          onChange={e => setSelectedStage(parseInt(e.target.value, 10))}
        >
          <option value={-1}>Not yet presented</option>
          <option value={MaterialProgressStage.PRESENTED}>Presented</option>
          <option value={MaterialProgressStage.PRACTICED}>Practiced</option>
          <option value={MaterialProgressStage.MASTERED}>Mastered</option>
        </Select>
      </Box>
    </ScrollableDialog>
  )
}

export default StudentMaterialProgressDialog
