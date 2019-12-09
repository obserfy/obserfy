import React, { FC, useState } from "react"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Box from "../Box/Box"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import { Observation } from "../../hooks/students/useQueryStudentObservations"
import Select from "../Select/Select"
import { categories } from "../../categories"

interface Props {
  onCancel: () => void
  onConfirm: (observations: Observation) => void
}
export const AddObservationDialog: FC<Props> = ({ onConfirm, onCancel }) => {
  const [shortDesc, setShortDesc] = useState("")
  const [details, setDetails] = useState("")
  const [category, setCategory] = useState(categories[0].id)

  return (
    <ScrollableDialog
      title="New Observation"
      positiveText="Add"
      negativeText="Cancel"
      onPositiveClick={() =>
        onConfirm({ longDesc: details, shortDesc, categoryId: category })
      }
      onDismiss={onCancel}
      onNegativeClick={onCancel}
      disablePositiveButton={shortDesc === ""}
    >
      <Box p={3}>
        <Select
          mb={3}
          label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </Select>
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
