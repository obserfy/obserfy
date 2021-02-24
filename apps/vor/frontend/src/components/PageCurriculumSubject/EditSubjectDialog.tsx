import { t } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"

const EditSubjectDialog: FC<{
  onDismiss: () => void
  onSave: () => void
}> = ({ onDismiss, onSave }) => {
  const [value, setValue] = useState("")

  return (
    <Dialog>
      <DialogHeader
        title="Edit dialog name"
        onCancel={onDismiss}
        onAccept={onSave}
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
