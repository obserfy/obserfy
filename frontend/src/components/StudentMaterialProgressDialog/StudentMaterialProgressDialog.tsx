import React, { FC } from "react"
import { FormattedDate } from "gatsby-plugin-intl3"
import Typography from "../Typography/Typography"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import { ProgressSummary } from "../StudentProgressSummaryCard/StudentProgressSummaryCard"

export const StudentMaterialProgressDialog: FC<{
  progress: ProgressSummary
  onDismiss: () => void
}> = ({ progress, onDismiss }) => (
  <ScrollableDialog
    title="Sandpaper Globe"
    positiveText="Set as Mastered"
    onDismiss={onDismiss}
    onPositiveClick={onDismiss}
    negativeText="nothing"
  >
    <Typography.Body mx={3} mt={3} fontSize={0} letterSpacing={1.5}>
      DATE PRESENTED
    </Typography.Body>
    <Typography.Body mx={3} mb={3}>
      <FormattedDate
        value={progress.presentedDate}
        month="short"
        day="2-digit"
        weekday="long"
      />
    </Typography.Body>
  </ScrollableDialog>
)

export default StudentMaterialProgressDialog
