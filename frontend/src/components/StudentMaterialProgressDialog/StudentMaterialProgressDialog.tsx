import React, { FC, useState } from "react"
import { useIntl } from "gatsby-plugin-intl3"
import {
  MaterialProgressStage,
  StudentMaterialProgress,
} from "../../api/useGetStudentMaterialProgress"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import { Material } from "../../api/useGetSubjectMaterials"
import Select from "../Select/Select"
import Box from "../Box/Box"
import { updateStudentMaterialProgress } from "../../api/updateStudentMaterialProgress"

export const StudentMaterialProgressDialog: FC<{
  studentId: string
  progress?: StudentMaterialProgress
  material?: Material
  onDismiss: () => void
  onSubmitted: () => void
}> = ({ onSubmitted, studentId, progress, material, onDismiss }) => {
  const [selectedStage, setSelectedStage] = useState(progress?.stage)
  const intl = useIntl()
  const lastUpdated = progress
    ? `Last updated ${intl.formatDate(progress.lastUpdated, {
        month: "short",
        day: "2-digit",
        weekday: "long",
      })}`
    : ""

  async function submitProgressUpdate(): Promise<void> {
    if (material === undefined || selectedStage === undefined) return
    const response = await updateStudentMaterialProgress(
      studentId,
      material.id,
      {
        stage: selectedStage,
      }
    )
    if (response.status === 200) {
      onSubmitted()
    }
  }

  return (
    <ScrollableDialog
      title={material?.name ?? ""}
      positiveText="Save changes"
      onDismiss={onDismiss}
      onPositiveClick={submitProgressUpdate}
      negativeText="Cancel"
      onNegativeClick={onDismiss}
      subtext={lastUpdated}
      disablePositiveButton={selectedStage === progress?.stage}
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
