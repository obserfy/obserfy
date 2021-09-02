import { FC, useState } from "react"
import { Box } from "theme-ui"
import dayjs from "../../dayjs"
import usePatchAssessments from "../../hooks/api/students/usePatchAssessments"
import { Assessment } from "../../hooks/api/useGetStudentAssessments"
import Chip from "../Chip/Chip"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"

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
  const patchStudentMaterialProgress = usePatchAssessments(
    studentId,
    materialId
  )
  const [selectedStage, setSelectedStage] = useState(stage)
  const subtext = lastUpdated
    ? `Updated ${dayjs(lastUpdated).format("DD MMM YYYY")}`
    : ""

  async function submitProgressUpdate(): Promise<void> {
    if (selectedStage === undefined) return
    try {
      await patchStudentMaterialProgress.mutateAsync({
        stage: selectedStage,
      })
      onDismiss()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        onAcceptText="Save"
        title="Material Progress"
        onCancel={onDismiss}
        onAccept={submitProgressUpdate}
        disableAccept={stage === selectedStage}
        loading={patchStudentMaterialProgress.isLoading}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Typography.Body mb={2}>{materialName}</Typography.Body>
        <Chip
          onClick={() => {
            setSelectedStage(
              selectedStage === Assessment.PRESENTED ? -1 : Assessment.PRESENTED
            )
          }}
          text="Presented"
          isActive={selectedStage === Assessment.PRESENTED}
          mr={2}
          mb={2}
        />
        <Chip
          onClick={() =>
            setSelectedStage(
              selectedStage === Assessment.PRACTICED ? -1 : Assessment.PRACTICED
            )
          }
          text="Practiced"
          isActive={selectedStage === Assessment.PRACTICED}
          mr={2}
          mb={2}
        />
        <Chip
          onClick={() =>
            setSelectedStage(
              selectedStage === Assessment.MASTERED ? -1 : Assessment.MASTERED
            )
          }
          text="Mastered"
          isActive={selectedStage === Assessment.MASTERED}
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
