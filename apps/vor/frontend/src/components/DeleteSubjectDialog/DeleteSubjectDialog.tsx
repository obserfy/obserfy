import { FC } from "react"

import { t, Trans } from "@lingui/macro"
import { track } from "../../analytics"
import Typography from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import useDeleteSubject from "../../hooks/api/curriculum/useDeleteSubject"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  areaId: string
  subjectId: string
  name?: string
  onDismiss: () => void
  onDeleted?: () => void
}
export const DeleteSubjectDialog: FC<Props> = ({
  areaId,
  onDismiss,
  subjectId,
  onDeleted,
  name = "",
}) => {
  const deleteSubject = useDeleteSubject(areaId, subjectId)

  const handleDelete = async () => {
    try {
      await deleteSubject.mutateAsync()
      track("Deleted Subject")
      onDismiss()
      if (onDeleted) onDeleted()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      <DialogHeader
        title={t`Delete Subject?`}
        onCancel={onDismiss}
        onAcceptText={t`Delete`}
        loading={deleteSubject.isLoading}
        onAccept={handleDelete}
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
