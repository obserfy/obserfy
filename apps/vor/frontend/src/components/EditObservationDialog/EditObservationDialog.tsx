import React, { FC, useState } from "react"
import { Box, Flex, Button } from "theme-ui"
import { categories } from "../../categories"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import { Observation } from "../../api/useGetStudentObservations"

import Dialog from "../Dialog/Dialog"

import Typography from "../Typography/Typography"

import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

interface Props {
  defaultValue?: Observation
  onDismiss: () => void
  onSaved: () => void
}
export const EditObservationDialog: FC<Props> = ({
  defaultValue,
  onDismiss,
  onSaved,
}) => {
  const [loading, setLoading] = useState(false)
  const [shortDesc, setShortDesc] = useState(defaultValue?.shortDesc ?? "")
  const [details, setDetails] = useState(defaultValue?.longDesc ?? "")
  const [category, setCategory] = useState(
    categories[defaultValue?.categoryId ?? 1]?.id ?? "0"
  )

  async function submitEditObservation(): Promise<void> {
    setLoading(true)
    const observation: Observation = {
      ...defaultValue,
      longDesc: details,
      shortDesc,
      categoryId: category,
    }
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/observations/${observation.id}`, {
      credentials: "same-origin",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })
    analytics.track("Observation Updated", {
      responseStatus: response.status,
      observationId: observation.id,
    })
    setLoading(false)
    onSaved()
  }

  return (
    <Dialog>
      <Flex
        sx={{
          flexDirection: "column",
          maxHeight: "100%",
        }}
      >
        <Flex
          backgroundColor="surface"
          sx={{
            alignItems: "center",
            position: "relative",
            borderBottomColor: "border",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          }}
        >
          <Typography.H6
            sx={{
              width: "100%",
              position: "absolute",
              pointerEvents: "none",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            Edit Observation
          </Typography.H6>
          <Button variant="outline" color="danger" m={2} onClick={onDismiss}>
            Cancel
          </Button>
          <Spacer />
          <Button
            m={2}
            disabled={shortDesc === ""}
            onClick={submitEditObservation}
          >
            {loading && <LoadingIndicator />}
            Save
          </Button>
        </Flex>
        <Box
          p={3}
          sx={{
            backgroundColor: "background",
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          <Input
            label="Short Description"
            sx={{ width: "100%" }}
            placeholder="What have you find?"
            onChange={(e) => setShortDesc(e.target.value)}
            value={shortDesc}
            mb={3}
          />
          <TextArea
            label="Details"
            sx={{
              width: "100%",
              fontSize: 2,
            }}
            placeholder="Tell us about what you observed"
            onChange={(e) => setDetails(e.target.value)}
            value={details}
            mb={3}
          />
          <Select
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            {categories.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>
    </Dialog>
  )
}

export default EditObservationDialog
