import { FC } from "react"
import Dialog from "../Dialog/Dialog"
import Typography from "../Typography/Typography"
import useDeleteArea from "../../hooks/api/curriculum/useDeleteArea"
import DialogHeader from "../DialogHeader/DialogHeader"
import { borderBottom } from "../../border"

interface Props {
  onDismiss: () => void
  onDeleted: () => void
  areaId: string
  name: string
}
export const DeleteAreaDialog: FC<Props> = ({
  onDeleted,
  areaId,
  onDismiss,
  name,
}) => {
  const deleteArea = useDeleteArea(areaId)

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      <DialogHeader
        title="Delete Area?"
        onCancel={onDismiss}
        onAccept={async () => {
          try {
            await deleteArea.mutateAsync()
            onDeleted()
          } catch (e) {
            Sentry.captureException(e)
          }
        }}
        loading={deleteArea.isLoading}
        onAcceptText="Delete"
      />
      <Typography.Body p={3} sx={{ ...borderBottom }}>
        <i>&quot;{name}&quot;</i> and student data related to it will be
        permanently deleted. Are you sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteAreaDialog
