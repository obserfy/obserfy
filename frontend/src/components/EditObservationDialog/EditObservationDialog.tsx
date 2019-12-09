import React, { FC, useState } from "react"
import { categories } from "../../categories"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Box from "../Box/Box"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import { Observation } from "../../hooks/students/useQueryStudentObservations"

interface Props {
  defaultValue?: Observation
  onCancel: () => void
  onConfirm: (observations: Observation) => void
}
export const EditObservationDialog: FC<Props> = ({
  defaultValue,
  onConfirm,
  onCancel,
}) => {
  const [shortDesc, setShortDesc] = useState(defaultValue?.shortDesc ?? "")
  const [details, setDetails] = useState(defaultValue?.longDesc ?? "")
  const [category, setCategory] = useState(categories[0].id)

  return (
    <ScrollableDialog
      title="Edit Observation"
      positiveText="Save"
      negativeText="Cancel"
      onPositiveClick={() =>
        onConfirm({
          ...defaultValue,
          longDesc: details,
          shortDesc,
          categoryId: category,
        })
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
            <option key={id} value={id}>
              {name}
            </option>
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

export default EditObservationDialog
