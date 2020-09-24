import React, { FC, useState } from "react"
import { Box } from "theme-ui"
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

  return (
    <Dialog>
      <DialogHeader
        title="Custom Curriculum"
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
          label="Curriculum Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: "100%" }}
          placeholder="Choose a Name"
        />
      </Box>
    </Dialog>
  )
}

export default NewCustomCurriculumDialog
