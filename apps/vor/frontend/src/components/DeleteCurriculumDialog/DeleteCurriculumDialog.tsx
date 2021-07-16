import { FC } from "react"
import { t, Trans } from "@lingui/macro"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"
import { borderBottom } from "../../border"
import useDeleteCurriculum from "../../hooks/api/curriculum/useDeleteCurriculum"

export interface DeleteCurriculumDialogProps {
  onDismiss: () => void
  name: string
}
const DeleteCurriculumDialog: FC<DeleteCurriculumDialogProps> = ({
  onDismiss,
  name,
}) => {
  const deleteCurriculum = useDeleteCurriculum()

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      <DialogHeader
        title={t`Delete Curriculum?`}
        onCancel={onDismiss}
        onAccept={async () => {
          try {
            await deleteCurriculum.mutateAsync()
            onDismiss()
          } catch (e) {
            Sentry.captureException(e)
          }
        }}
        loading={deleteCurriculum.isLoading}
        onAcceptText={t`Delete`}
      />
      <Typography.Body p={3} sx={{ ...borderBottom }}>
        <Trans>
          <i>&quot;{name}&quot;</i> curriculum and student data related to it
          will be permanently deleted. Are you sure?
        </Trans>
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteCurriculumDialog
