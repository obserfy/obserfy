import React, { FC, useState } from "react"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Box from "../Box/Box"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import { Observation } from "../../hooks/students/useQueryStudentObservations"

interface Props {
  defaultValue?: Observation
  onCancel: () => void
  onConfirm: (observations: Observation) => void
}
export const AddObservationDialog: FC<Props> = ({
  defaultValue,
  onConfirm,
  onCancel,
}) => {
  const [shortDesc, setShortDesc] = useState(defaultValue?.shortDesc ?? "")
  const [details, setDetails] = useState(defaultValue?.longDesc ?? "")
  return (
    <ScrollableDialog
      title={defaultValue ? "Edit Observation" : "New Observation"}
      positiveText={defaultValue ? "Save" : "Add"}
      negativeText="Cancel"
      onPositiveClick={() => onConfirm({ longDesc: details, shortDesc })}
      onDismiss={onCancel}
      onNegativeClick={onCancel}
      disablePositiveButton={shortDesc === ""}
    >
      <Box p={3}>
        <Input
          label="Short Description"
          width="100%"
          placeholder="What have you find?"
          onChange={e => setShortDesc(e.target.value)}
          value={shortDesc}
          mb={3}
        />
        <TextArea
          label="Details"
          width="100%"
          fontSize={2}
          placeholder="Tell us about what you observed"
          onChange={e => setDetails(e.target.value)}
          value={details}
        />
      </Box>
    </ScrollableDialog>
  )
}

export default AddObservationDialog
