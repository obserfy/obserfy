import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import { MaterialProgressStage } from "../../api/useGetStudentMaterialProgress"
import dayjs from "../../dayjs"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"
import Chip from "../Chip/Chip"
import usePatchStudentMaterialProgress from "../../api/students/usePatchStudentMaterialProgress"

export const StudentMaterialProgressDialog: FC<{
  studentId: string
  // material?: Material
  // progress?: MaterialProgress
  materialId: string
  materialName: string
  stage?: number
  lastUpdated?: string
  onDismiss: () => void
}> = ({
  materialId,
  materialName,
  stage,
  lastUpdated,
  studentId,
  onDismiss,
  // progress,
}) => {
  const [
    patchStudentMaterialProgress,
    { isLoading },
  ] = usePatchStudentMaterialProgress(studentId, materialId)
  const [selectedStage, setSelectedStage] = useState(stage)
  const subtext = lastUpdated
    ? `Updated ${dayjs(lastUpdated).format("DD MMM YYYY")}`
    : ""

  async function submitProgressUpdate(): Promise<void> {
    if (selectedStage === undefined) return
    const response = await patchStudentMaterialProgress({
      stage: selectedStage,
    })
    if (response?.ok) onDismiss()
  }

  return (
    <Dialog>
      <DialogHeader
        onAcceptText="Save"
        title="Material Progress"
        onCancel={onDismiss}
        onAccept={submitProgressUpdate}
        disableAccept={stage === selectedStage}
        loading={isLoading}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Typography.Body mb={2}>{materialName}</Typography.Body>
        <Chip
          onClick={() => {
            setSelectedStage(
              selectedStage === MaterialProgressStage.PRESENTED
                ? -1
                : MaterialProgressStage.PRESENTED
            )
          }}
          text="Presented"
          isActive={selectedStage === MaterialProgressStage.PRESENTED}
          mr={2}
          mb={2}
        />
        <Chip
          onClick={() =>
            setSelectedStage(
              selectedStage === MaterialProgressStage.PRACTICED
                ? -1
                : MaterialProgressStage.PRACTICED
            )
          }
          text="Practiced"
          isActive={selectedStage === MaterialProgressStage.PRACTICED}
          mr={2}
          mb={2}
        />
        <Chip
          onClick={() =>
            setSelectedStage(
              selectedStage === MaterialProgressStage.MASTERED
                ? -1
                : MaterialProgressStage.MASTERED
            )
          }
          text="Mastered"
          isActive={selectedStage === MaterialProgressStage.MASTERED}
          mr={2}
          mb={2}
        />
      </Box>
      {lastUpdated && (
        <Typography.Body
          p={3}
          sx={{ color: "textMediumEmphasis", fontSize: 0 }}
        >
          {subtext}
        </Typography.Body>
      )}
    </Dialog>
  )
}

export default StudentMaterialProgressDialog
