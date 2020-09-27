import React, { FC } from "react"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"
import { borderBottom } from "../../border"
import useDeleteCurriculum from "../../api/curriculum/useDeleteCurriculum"

export interface DeleteCurriculumDialogProps {
  onDismiss: () => void
  name: string
}
const DeleteCurriculumDialog: FC<DeleteCurriculumDialogProps> = ({
  onDismiss,
  name,
}) => {
  const [deleteCurriculum, { isLoading }] = useDeleteCurriculum()

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      <DialogHeader
        title="Delete Curriculum?"
        onCancel={onDismiss}
        onAccept={async () => {
          const response = await deleteCurriculum()
          if (response?.ok) {
            onDismiss()
          }
        }}
        loading={isLoading}
        onAcceptText="Delete"
      />
      <Typography.Body p={3} sx={{ ...borderBottom }}>
        <i>&quot;{name}&quot;</i> curriculum and student data related to it will
        be permanently deleted. Are you sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteCurriculumDialog
