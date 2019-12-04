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

interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [showAddObservationDialog, setShowObservationDialog] = useState(false)
  const [editObservations, setEditObservations] = useState()
  const [details] = useQueryStudentDetails(id)
  const [observations, setObservationsAsOutdated] = useQueryStudentObservations(
    id
  )

  function addObservation(): void {
    setEditObservations(undefined)
    setShowObservationDialog(true)
  }

  async function submitNewObservation(observation: Observation): Promise<void> {
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

  const listOfObservations = observations?.map(({ longDesc, shortDesc }) => (
    <Card
      p={3}
      mb={3}
      onClick={() => {
        setEditObservations({ longDesc, shortDesc })
        setShowObservationDialog(true)
      }}
    >
      <Flex alignItems="center">
        <Box>
          <Typography.Body fontSize={1} color="textMediumEmphasis">
            Thursday, 26 Dec &amp;19
          </Typography.Body>
          <Typography.H5>{shortDesc}</Typography.H5>
        </Box>
        <Spacer />
        <Icon as={NextIcon} m={0} />
      </Flex>
    </Card>
  ))

  const emptyObservationPlaceholder = observations?.length &&
    observations.length < 1 && (
      <EmptyListPlaceholder
        text="What did you observe?"
        callToActionText="add observation"
        onActionClick={addObservation}
      />
    )

  const addObservationDialog = showAddObservationDialog && (
    <AddObservationDialog
      defaultValue={editObservations}
      onCancel={() => setShowObservationDialog(false)}
      onConfirm={observation => {
        submitNewObservation(observation)
        setShowObservationDialog(false)
      }}
    />
  )

  return (
    <>
      <Box>
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
        <Icon as={PlusIcon} m={0} mr={2} fill="onPrimary" /> New observation
      </FloatingActionButton>
      {addObservationDialog}
    </>
  )
}

export default PageStudentDetails
