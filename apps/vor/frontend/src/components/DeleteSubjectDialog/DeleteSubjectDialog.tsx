import React, { FC } from "react"

import Typography from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import useDeleteSubject from "../../api/curriculum/useDeleteSubject"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  subjectId: string
  name: string
  onDismiss: () => void
  onDeleted: () => void
}
export const DeleteSubjectDialog: FC<Props> = ({
  onDeleted,
  onDismiss,
  subjectId,
  name,
}) => {
  const [deleteSubject, { isLoading }] = useDeleteSubject(subjectId)

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      <DialogHeader
        title="Delete Subject?"
        onCancel={onDismiss}
        onAcceptText="Delete"
        loading={isLoading}
        onAccept={async () => {
          const response = await deleteSubject()
          if (response) {
            analytics.track("Deleted Subject")
            onDeleted()
          }
        }}
      />
      <Typography.Body p={3}>
        <i>&quot;{name}&quot;</i> and student data related to it will be
        permanently deleted. Are you sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteSubjectDialog
