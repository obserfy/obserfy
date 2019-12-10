import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import AddObservationDialog from "../AddObservationDialog/AddObservationDialog"
import Button from "../Button/Button"
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import {
  Observation,
  useQueryStudentObservations,
} from "../../hooks/students/useQueryStudentObservations"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import { getAnalytics } from "../../analytics"
import ObservationCard from "../ObservationCard/ObservationCard"

interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [isAddingObservation, setIsAddingObservation] = useState(false)
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)
  const [targetObservation, setTargetObservation] = useState()
  const [details] = useQueryStudentDetails(id)
  const [observations, setObservationsAsOutdated] = useQueryStudentObservations(
    id
  )

  function addObservation(): void {
    setTargetObservation(undefined)
    setIsAddingObservation(true)
  }
  async function submitAddObservation(observation: Observation): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/students/${id}/observations`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })
    setIsAddingObservation(false)
    setObservationsAsOutdated()

    getAnalytics()?.track("Observation Created", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }
  async function submitEditObservation(
    observation: Observation
  ): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/observations/${observation.id}`, {
      credentials: "same-origin",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })
    setIsAddingObservation(false)
    setObservationsAsOutdated()
    getAnalytics()?.track("Observation Updated", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }
  async function submitDeleteObservation(
    observation: Observation
  ): Promise<void> {
    const baseUrl = "/api/v1"
    const response = await fetch(`${baseUrl}/observations/${observation.id}`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    setObservationsAsOutdated()
    setIsDeletingObservation(false)
    getAnalytics()?.track("Observation Deleted", {
      responseStatus: response.status,
      observationId: observation.id,
    })
  }

  const listOfObservations = observations?.reverse()?.map(observation => (
    <ObservationCard
      key={observation.id}
      observation={observation}
      onDelete={value => {
        setTargetObservation(value)
        setIsDeletingObservation(true)
      }}
      onEdit={value => {
        setTargetObservation(value)
        setIsEditingObservation(true)
      }}
    />
  ))

  const emptyObservationPlaceholder = (observations ?? []).length === 0 && (
    <EmptyListPlaceholder
      text="No observation have been added"
      callToActionText="add observation"
      onActionClick={addObservation}
    />
  )

  const addObservationDialog = isAddingObservation && (
    <AddObservationDialog
      onCancel={() => setIsAddingObservation(false)}
      onConfirm={observation => {
        submitAddObservation(observation)
        setIsAddingObservation(false)
      }}
    />
  )

  const editObservationDialog = isEditingObservation && (
    <EditObservationDialog
      defaultValue={targetObservation}
      onCancel={() => setIsEditingObservation(false)}
      onConfirm={observation => {
        submitEditObservation(observation)
        setIsEditingObservation(false)
      }}
    />
  )

  const deleteObservationDialog = isDeletingObservation && (
    <DeleteObservationDialog
      observation={targetObservation}
      onConfirm={target => submitDeleteObservation(target)}
      onCancel={() => setIsDeletingObservation(false)}
    />
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation text="Home" to="/" />
        <Flex alignItems="center" mx={3} mb={3}>
          <Typography.H3>
            {details?.name || <LoadingPlaceholder width="24rem" height={60} />}
          </Typography.H3>
        </Flex>
        <Button
          ml={3}
          variant="outline"
          onClick={() => navigate(`/students/edit?id=${id}`)}
        >
          Edit student
        </Button>
        <Box p={3}>
          <Typography.H4 color="textMediumEmphasis" mb={2}>
            Observations
          </Typography.H4>
          {emptyObservationPlaceholder}
          {listOfObservations}
        </Box>
      </Box>
      <FloatingActionButton onClick={addObservation}>
        <Icon as={PlusIcon} m={0} mr={2} fill="onPrimary" /> Add observation
      </FloatingActionButton>
      {addObservationDialog}
      {editObservationDialog}
      {deleteObservationDialog}
    </>
  )
}

export default PageStudentDetails
