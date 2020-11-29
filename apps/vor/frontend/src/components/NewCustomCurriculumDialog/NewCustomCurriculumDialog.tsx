import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import DialogHeader from "../DialogHeader/DialogHeader"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import usePostNewCurriculum from "../../api/curriculum/usePostNewCurriculum"

export interface NewCustomCurriculumDialogProps {
  onDismiss: () => void
}
const NewCustomCurriculumDialog: FC<NewCustomCurriculumDialogProps> = ({
  onDismiss,
}) => {
  const [postNewCurriculum, { isLoading }] = usePostNewCurriculum()
  const [name, setName] = useState("")
  const { i18n } = useLingui()

  return (
    <Dialog>
      <DialogHeader
        title={i18n._(t`Custom Curriculum`)}
        onAccept={async () => {
          const response = await postNewCurriculum({
            template: "custom",
            name,
          })
          if (response?.ok) {
            onDismiss()
          }
        }}
        onCancel={onDismiss}
        loading={isLoading}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input
          label={i18n._(t`Curriculum Name`)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: "100%" }}
          placeholder={i18n._(t`Choose a Name`)}
        />
      </Box>
    </Dialog>
  )
}

export default NewCustomCurriculumDialog
