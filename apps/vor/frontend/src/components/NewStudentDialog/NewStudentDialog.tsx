import React, { FC, useState } from "react"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import { Box } from "../Box/Box"
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
          width="100%"
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
