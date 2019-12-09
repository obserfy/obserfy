import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Card from "../Card/Card"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
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
import Pill from "../Pill/Pill"
import { categories } from "../../categories"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"

interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [showAddObservationDialog, setShowObservationDialog] = useState(false)
  const [showEditObservationDialog, setShowEditObservationDialog] = useState(
    false
  )
  const [editObservations, setEditObservations] = useState()
  const [details] = useQueryStudentDetails(id)
  const [observations, setObservationsAsOutdated] = useQueryStudentObservations(
    id
  )

  function addObservation(): void {
    setEditObservations(undefined)
    setShowObservationDialog(true)
  }

  async function submitAddObservation(observation: Observation): Promise<void> {
    const baseUrl = "/api/v1"

    await fetch(`${baseUrl}/students/${id}/observations`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })

    setShowObservationDialog(false)
    setObservationsAsOutdated()
  }

  async function submitEditObservation(
    observation: Observation
  ): Promise<void> {
    const baseUrl = "/api/v1"

    await fetch(`${baseUrl}/observations/${observation.id}`, {
      credentials: "same-origin",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    })

    setShowObservationDialog(false)
    setObservationsAsOutdated()
  }

  const listOfObservations = observations?.reverse()?.map(observation => {
    const category = categories[parseInt(observation.categoryId, 10)]
    return (
      <Card
        mb={2}
        onClick={() => {
          setEditObservations(observation)
          setShowEditObservationDialog(true)
        }}
      >
        <Flex
          p={3}
          alignItems="center"
          sx={{
            cursor: "pointer",
            borderBottomWidth: 1,
            borderBottomColor: "border",
            borderBottomStyle: "solid",
          }}
        >
          <Flex flexDirection="column" alignItems="start">
            <Typography.H6 mb={2}>{observation.shortDesc}</Typography.H6>
            <Pill
              backgroundColor={category.color}
              text={category.name}
              color={category.onColor}
            />
          </Flex>
          <Spacer />
          <Icon as={NextIcon} m={0} />
        </Flex>
        <Typography.Body fontSize={1} p={3}>
          {observation.longDesc}
        </Typography.Body>
      </Card>
    )
  })

  const emptyObservationPlaceholder = (observations ?? []).length === 0 && (
    <EmptyListPlaceholder
      text="No observation have been added"
      callToActionText="add observation"
      onActionClick={addObservation}
    />
  )

  const addObservationDialog = showAddObservationDialog && (
    <AddObservationDialog
      onCancel={() => setShowObservationDialog(false)}
      onConfirm={observation => {
        submitAddObservation(observation)
        setShowObservationDialog(false)
      }}
    />
  )

  const editObservationDialog = showEditObservationDialog && (
    <EditObservationDialog
      defaultValue={editObservations}
      onCancel={() => setShowEditObservationDialog(false)}
      onConfirm={observation => {
        submitEditObservation(observation)
        setShowEditObservationDialog(false)
      }}
    />
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
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
    </>
  )
}

export default PageStudentDetails
