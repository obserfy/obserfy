import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Input from "../Input/Input"

interface Props {
  onCancel: () => void
  onConfirm: (name: string) => void
}
export const NewStudentDialog: FC<Props> = ({ onConfirm, onCancel }) => {
  const [name, setName] = useState("")
  return (
    <ScrollableDialog
      title="New Student"
      positiveText="Add student"
      negativeText="Cancel"
      onPositiveClick={() => onConfirm(name)}
      onDismiss={onCancel}
      onNegativeClick={onCancel}
      disablePositiveButton={name === ""}
    >
      <Box p={3}>
        <Input
          label="Full Name"
          sx={{ width: "100%" }}
          placeholder="Erica Sterling"
          onChange={(e) => setName(e.target.value)}
          value={name}
          onEnterPressed={() => onConfirm(name)}
        />
      </Box>
    </ScrollableDialog>
  )
}

export default NewStudentDialog
