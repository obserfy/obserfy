import { t } from "@lingui/macro"
import { FC, useState } from "react"
import { Box } from "theme-ui"
import usePatchSubject from "../../hooks/api/curriculum/usePatchSubject"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"

const EditSubjectDialog: FC<{
  initialValue?: string
  onDismiss: () => void
  onSave: () => void
  subjectId: string
  areaId: string
}> = ({ initialValue = "", subjectId, onDismiss, onSave, areaId }) => {
  const [value, setValue] = useState(initialValue)
  const patchSubject = usePatchSubject(subjectId, areaId)

  const handleSave = async () => {
    try {
      const result = await patchSubject.mutateAsync({ name: value })
      if (result?.ok) onSave()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title="Edit dialog name"
        onCancel={onDismiss}
        onAccept={handleSave}
      />

      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input
          label={t`Subject name`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>
    </Dialog>
  )
}

export default EditSubjectDialog
