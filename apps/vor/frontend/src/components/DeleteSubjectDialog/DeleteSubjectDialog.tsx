import React, { FC } from "react"

import { t, Trans } from "@lingui/macro"
import Typography from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import useDeleteSubject from "../../hooks/api/curriculum/useDeleteSubject"
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
        title={t`Delete Subject?`}
        onCancel={onDismiss}
        onAcceptText={t`Delete`}
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
        <Trans>
          <i>&quot;{name}&quot;</i> and student data related to it will be
          permanently deleted. Are you sure?
        </Trans>
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteSubjectDialog
