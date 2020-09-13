import React, { FC } from "react"
import Typography from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import useDeleteObservation from "../../api/observations/useDeleteObservation"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  shortDesc: string
  observationId: string
  onDeleted: () => void
  onDismiss: () => void
}
export const DeleteObservationDialog: FC<Props> = ({
  onDismiss,
  observationId,
  shortDesc,
  onDeleted,
}) => {
  const [deleteObservation, { isLoading }] = useDeleteObservation(observationId)

  return (
    <Dialog>
      <DialogHeader
        onAcceptText="Yes"
        title="Delete Observation?"
        loading={isLoading}
        onCancel={onDismiss}
        onAccept={async () => {
          const response = await deleteObservation()
          if (response.ok) {
            analytics.track("Observation Deleted", { observationId })
            onDeleted()
          }
        }}
      />
      <Typography.Body p={3}>
        <i>&quot;{shortDesc}&quot;</i> will be permanently deleted. Are you
        sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteObservationDialog
