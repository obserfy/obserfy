import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import { t } from "@lingui/macro"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import DialogHeader from "../DialogHeader/DialogHeader"
import usePatchCurriculum from "../../hooks/api/curriculum/usePatchCurriculum"

export interface EditCurriculumDialogProps {
  curriculumId: string
  onDismiss: () => void
  originalValue?: string
}
const EditCurriculumDialog: FC<EditCurriculumDialogProps> = ({
  curriculumId,
  onDismiss,
  originalValue = "",
}) => {
  const [name, setName] = useState(originalValue)
  const [patchCurriculum, { isLoading }] = usePatchCurriculum(curriculumId)

  return (
    <Dialog>
      <DialogHeader
        title={t`Edit Curriculum`}
        onCancel={onDismiss}
        onAccept={async () => {
          const response = await patchCurriculum({ name })
          if (response?.ok) {
            onDismiss()
          }
        }}
      />
      <Box px={3} pb={3} pt={3} sx={{ backgroundColor: "background" }}>
        <Input
          disabled={isLoading}
          autoFocus
          label={t`Curriculum name`}
          sx={{ width: "100%" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
    </Dialog>
  )
}

export default EditCurriculumDialog
